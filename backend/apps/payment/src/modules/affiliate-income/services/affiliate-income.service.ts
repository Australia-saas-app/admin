import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AffiliateIncome } from '@/entities/affiliate-income.entity';
import { Transaction, TransactionType, TransactionStatus } from '@/entities/transaction.entity';
import { AffiliateWithdrawalDto } from '../dto/withdrawal.dto';
import { AffiliateIncomeHistoryQueryDto } from '../dto/history-query.dto';
import { AffiliateReferralsQueryDto } from '../dto/referrals-query.dto';

@Injectable()
export class AffiliateIncomeService {
  constructor(
    @InjectRepository(AffiliateIncome)
    private readonly affiliateIncomeRepository: Repository<AffiliateIncome>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getIncomeBalance(affiliateId: string) {
    const incomes = await this.affiliateIncomeRepository.find({
      where: { affiliateId },
    });

    const availableBalance = incomes
      .filter(i => i.status === 'paid' && i.type !== 'withdrawal')
      .reduce((sum, i) => sum + i.amount, 0);

    const pendingBalance = incomes
      .filter(i => i.status === 'pending' && i.type !== 'withdrawal')
      .reduce((sum, i) => sum + i.amount, 0);

    const totalEarned = incomes
      .filter(i => i.type !== 'withdrawal')
      .reduce((sum, i) => sum + i.amount, 0);

    const withdrawals = incomes
      .filter(i => i.type === 'withdrawal' && i.status === 'paid')
      .sort((a, b) => b.paidAt!.getTime() - a.paidAt!.getTime());

    const lastPayout = withdrawals.length > 0 ? withdrawals[0].paidAt : null;

    return {
      availableBalance,
      pendingBalance,
      totalEarned,
      lastPayout,
      currency: 'USD', // TODO: Make configurable
    };
  }

  async getIncomeHistory(affiliateId: string, query: AffiliateIncomeHistoryQueryDto) {
    const { page = 1, limit = 10, startDate, endDate, type } = query;
    const skip = (page - 1) * limit;

    let whereConditions: any = { affiliateId };

    if (startDate || endDate) {
      whereConditions.createdAt = {};
      if (startDate) whereConditions.createdAt.$gte = new Date(startDate);
      if (endDate) whereConditions.createdAt.$lte = new Date(endDate);
    }

    if (type) {
      whereConditions.type = type;
    }

    const [incomes, total] = await this.affiliateIncomeRepository.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      incomes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async requestWithdrawal(affiliateId: string, withdrawalDto: AffiliateWithdrawalDto) {
    const balance = await this.getIncomeBalance(affiliateId);

    if (balance.availableBalance < withdrawalDto.amount) {
      throw new BadRequestException('Insufficient available balance for withdrawal');
    }

    // Create withdrawal record
    const withdrawal = this.affiliateIncomeRepository.create({
      affiliateId,
      amount: -withdrawalDto.amount, // Negative for withdrawal
      currency: withdrawalDto.currency,
      type: 'withdrawal',
      status: 'pending',
    });

    await this.affiliateIncomeRepository.save(withdrawal);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      userId: affiliateId,
      amount: withdrawalDto.amount,
      currency: withdrawalDto.currency,
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      description: 'Affiliate income withdrawal',
      transactionId: `withdrawal_${Date.now()}_${affiliateId}`,
    });

    await this.transactionRepository.save(transaction);

    return {
      withdrawalId: withdrawal.id,
      transactionId: transaction.transactionId,
      amount: withdrawalDto.amount,
      bankDetails: withdrawalDto.bankDetails,
      status: 'pending_admin_approval',
    };
  }

  async getCommissionRates() {
    // TODO: Fetch from database or config
    // For now, return static rates
    return [
      {
        businessType: 'construction',
        rate: 0.05,
        description: '5% commission on construction service bookings',
      },
      {
        businessType: 'real_estate',
        rate: 0.03,
        description: '3% commission on real estate transactions',
      },
      {
        businessType: 'commercial',
        rate: 0.04,
        description: '4% commission on commercial services',
      },
    ];
  }

  async getReferrals(affiliateId: string, query: AffiliateReferralsQueryDto) {
    // TODO: Implement referrals tracking
    // This would require a referrals table/entity
    // For now, return empty array
    const { page = 1, limit = 10, status } = query;

    return {
      referrals: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }
}