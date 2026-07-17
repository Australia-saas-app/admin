import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Affiliate } from '../entities/affiliate.entity';
import { WalletTransaction } from '../entities/wallet-transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Affiliate) private affiliateRepository: Repository<Affiliate>,
    @InjectRepository(WalletTransaction) private transactionRepository: Repository<WalletTransaction>,
  ) {}

  async getWalletBalance(affiliateId: string): Promise<any> {
    let affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      // Create affiliate record if not found
      const referralCodeGenerated = `REF${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      affiliate = this.affiliateRepository.create({
        userId: affiliateId,
        referralCode: referralCodeGenerated,
      });
      await this.affiliateRepository.save(affiliate);
    }

    return {
      balance: affiliate.totalEarnings - affiliate.pendingEarnings,
      currency: 'USD', // Assuming USD
    };
  }

  async transferToMainWallet(affiliateId: string, amount: number, currency: string): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new BadRequestException('Affiliate not found');
    }

    const available = affiliate.totalEarnings - affiliate.pendingEarnings;
    if (amount > available) {
      throw new BadRequestException('Insufficient funds');
    }

    // Deduct from affiliate earnings
    affiliate.totalEarnings -= amount;
    await this.affiliateRepository.save(affiliate);

    // Record transaction
    const transaction = this.transactionRepository.create({
      affiliateId: affiliate.id,
      type: 'debit',
      amount,
      currency,
      description: 'Transfer to main wallet',
    });
    await this.transactionRepository.save(transaction);

    return { success: true, transaction };
  }

  async getWalletTransactions(affiliateId: string, page: number = 1, limit: number = 20): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new BadRequestException('Affiliate not found');
    }
    
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { affiliateId: affiliate.id },
      order: { createdAt: 'DESC' },
      skip,
      take: limitNum,
    });

    return {
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }
}