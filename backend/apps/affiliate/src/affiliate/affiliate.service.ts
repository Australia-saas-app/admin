import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Affiliate } from '../entities/affiliate.entity';
import { Withdrawal } from '../entities/withdrawal.entity';

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(Affiliate) private affiliateRepository: Repository<Affiliate>,
    @InjectRepository(Withdrawal) private withdrawalRepository: Repository<Withdrawal>,
  ) {}

  async getEarningsSummary(affiliateId: string): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return {
      totalEarnings: affiliate.totalEarnings,
      pendingEarnings: affiliate.pendingEarnings,
      availableForWithdrawal: affiliate.totalEarnings - affiliate.pendingEarnings,
    };
  }

  async requestWithdrawal(affiliateId: string, amount: number, currency: string, method: string): Promise<Withdrawal> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    const available = affiliate.totalEarnings - affiliate.pendingEarnings;
    if (amount > available) {
      throw new BadRequestException('Insufficient funds');
    }

    const withdrawal = this.withdrawalRepository.create({
      affiliateId: affiliate.id,
      amount,
      currency,
      method,
      status: 'pending',
    });

    await this.withdrawalRepository.save(withdrawal);

    // Update pending earnings
    affiliate.pendingEarnings += amount;
    await this.affiliateRepository.save(affiliate);

    return withdrawal;
  }

  async getWithdrawalHistory(affiliateId: string, page: number = 1, limit: number = 20): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const [withdrawals, total] = await this.withdrawalRepository.findAndCount({
      where: { affiliateId: affiliate.id },
      order: { createdAt: 'DESC' },
      skip,
      take: limitNum,
    });

    return {
      data: withdrawals,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getAllAffiliates(page: number = 1, limit: number = 20): Promise<any> {
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const [affiliates, total] = await this.affiliateRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limitNum,
    });

    return {
      data: affiliates,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async createAffiliate(userId: string): Promise<Affiliate> {
    const existing = await this.affiliateRepository.findOne({ where: { userId } });
    if (existing) {
      throw new BadRequestException('Affiliate already exists');
    }

    const affiliate = this.affiliateRepository.create({
      userId,
      totalEarnings: 0,
      pendingEarnings: 0,
    });

    return await this.affiliateRepository.save(affiliate);
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return await this.withdrawalRepository.find({ where: { status: 'pending' } });
  }

  async approveWithdrawal(withdrawalId: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id: withdrawalId } });
    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    withdrawal.status = 'approved';
    await this.withdrawalRepository.save(withdrawal);

    // Update affiliate earnings
    const affiliate = await this.affiliateRepository.findOne({ where: { id: withdrawal.affiliateId } });
    if (affiliate) {
      affiliate.pendingEarnings -= withdrawal.amount;
      await this.affiliateRepository.save(affiliate);
    }

    return withdrawal;
  }

  async rejectWithdrawal(withdrawalId: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id: withdrawalId } });
    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    withdrawal.status = 'rejected';
    await this.withdrawalRepository.save(withdrawal);

    // Refund pending earnings
    const affiliate = await this.affiliateRepository.findOne({ where: { id: withdrawal.affiliateId } });
    if (affiliate) {
      affiliate.pendingEarnings -= withdrawal.amount;
      await this.affiliateRepository.save(affiliate);
    }

    return withdrawal;
  }
}