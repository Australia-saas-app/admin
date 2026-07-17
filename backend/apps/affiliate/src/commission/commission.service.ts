import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commission } from '../entities/commission.entity';
import { Referral } from '../entities/referral.entity';
import { Affiliate } from '../entities/affiliate.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Commission) private commissionRepository: Repository<Commission>,
    @InjectRepository(Referral) private referralRepository: Repository<Referral>,
    @InjectRepository(Affiliate) private affiliateRepository: Repository<Affiliate>,
  ) {}

  async getCommissions(affiliateId: string, page: number = 1, limit: number = 20): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const [commissions, total] = await this.commissionRepository.findAndCount({
      where: { affiliateId: affiliate.id },
      order: { createdAt: 'DESC' },
      skip,
      take: limitNum,
    });

    return {
      data: commissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getPendingCommissions(affiliateId: string): Promise<Commission[]> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    return this.commissionRepository.find({ where: { affiliateId: affiliate.id, status: 'pending' } });
  }

  async getPaidCommissions(affiliateId: string, page: number = 1, limit: number = 20): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const [commissions, total] = await this.commissionRepository.findAndCount({
      where: { affiliateId: affiliate.id, status: 'paid' },
      order: { paidAt: 'DESC' },
      skip,
      take: limitNum,
    });

    return {
      data: commissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async calculateCommission(referralId: string): Promise<Commission> {
    const referral = await this.referralRepository.findOne({ where: { id: referralId } });
    if (!referral || referral.status !== 'completed') {
      throw new Error('Referral not completed');
    }

    // Example: fixed commission of 10
    const amount = 10;

    const commission = this.commissionRepository.create({
      affiliateId: referral.affiliateId,
      referralId,
      amount,
      status: 'pending',
    });

    await this.commissionRepository.save(commission);

    // Update affiliate earnings
    const affiliate = await this.affiliateRepository.findOne({ where: { id: referral.affiliateId } });
    if (affiliate) {
      affiliate.totalEarnings += amount;
      await this.affiliateRepository.save(affiliate);
    }

    // Update referral commission
    referral.commissionEarned = amount;
    await this.referralRepository.save(referral);

    return commission;
  }

  async payCommission(commissionId: string): Promise<Commission> {
    const commission = await this.commissionRepository.findOne({ where: { id: commissionId } });
    if (!commission) {
      throw new Error('Commission not found');
    }

    commission.status = 'paid';
    commission.paidAt = new Date();
    await this.commissionRepository.save(commission);

    return commission;
  }
}