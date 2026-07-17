import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDeposit } from '@/entities/security-deposit.entity';
import { AffiliateIncome } from '@/entities/affiliate-income.entity';
import { Transaction, TransactionType, TransactionStatus } from '@/entities/transaction.entity';
import { SetDepositAmountDto } from '../dto/set-deposit.dto';
import { ProcessDepositRefundDto } from '../dto/process-refund.dto';
import { SetCommissionRatesDto } from '../dto/set-commission-rates.dto';
import { ProcessAffiliatePayoutDto } from '../dto/process-payout.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(SecurityDeposit)
    private readonly securityDepositRepository: Repository<SecurityDeposit>,
    @InjectRepository(AffiliateIncome)
    private readonly affiliateIncomeRepository: Repository<AffiliateIncome>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async setDepositAmount(agencyId: string, setDepositDto: SetDepositAmountDto) {
    // TODO: Store deposit requirements per agency
    // For now, just return confirmation
    return {
      agencyId,
      depositAmount: setDepositDto.depositAmount,
      currency: setDepositDto.currency,
      status: 'updated',
    };
  }

  async processDepositRefund(agencyId: string, refundDto: ProcessDepositRefundDto) {
    const deposits = await this.securityDepositRepository.find({
      where: { agencyId, status: 'paid' },
      order: { createdAt: 'DESC' },
    });

    if (deposits.length === 0) {
      throw new NotFoundException('No active deposits found for this agency');
    }

    const totalDeposited = deposits.reduce((sum, d) => sum + d.amount, 0);
    const totalRefunded = deposits
      .filter(d => d.status === 'refunded' || d.status === 'partial_refund')
      .reduce((sum, d) => sum + d.amount, 0);

    const availableBalance = totalDeposited - totalRefunded;

    if (availableBalance < refundDto.amount) {
      throw new BadRequestException('Insufficient deposit balance for refund');
    }

    // Create refund record
    const refund = this.securityDepositRepository.create({
      agencyId,
      amount: refundDto.amount,
      currency: 'USD', // TODO: Get from deposit
      status: 'refunded',
      paymentDate: new Date(),
      refundDate: new Date(),
      transactionId: `refund_${Date.now()}_${agencyId}`,
    });

    await this.securityDepositRepository.save(refund);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      userId: agencyId,
      amount: refundDto.amount,
      currency: 'USD',
      type: TransactionType.REFUND,
      status: TransactionStatus.COMPLETED,
      description: `Security deposit refund: ${refundDto.reason}`,
      transactionId: refund.transactionId,
    });

    await this.transactionRepository.save(transaction);

    return {
      refundId: refund.id,
      agencyId,
      amount: refundDto.amount,
      reason: refundDto.reason,
      transactionId: transaction.transactionId,
      status: 'processed',
    };
  }

  async setCommissionRates(setRatesDto: SetCommissionRatesDto) {
    // TODO: Store commission rates in database
    // For now, just return confirmation
    return {
      rates: setRatesDto.rates,
      status: 'updated',
      updatedAt: new Date(),
    };
  }

  async processAffiliatePayout(affiliateId: string, payoutDto: ProcessAffiliatePayoutDto) {
    const balance = await this.getAffiliateBalance(affiliateId);

    if (balance.availableBalance < payoutDto.amount) {
      throw new BadRequestException('Insufficient available balance for payout');
    }

    // Create payout record
    const payout = this.affiliateIncomeRepository.create({
      affiliateId,
      amount: -payoutDto.amount,
      currency: 'USD',
      type: 'withdrawal',
      status: 'paid',
      paidAt: new Date(),
    });

    await this.affiliateIncomeRepository.save(payout);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      userId: affiliateId,
      amount: payoutDto.amount,
      currency: 'USD',
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.COMPLETED,
      description: 'Affiliate income payout',
      transactionId: `payout_${Date.now()}_${affiliateId}`,
    });

    await this.transactionRepository.save(transaction);

    return {
      payoutId: payout.id,
      affiliateId,
      amount: payoutDto.amount,
      paymentMethod: payoutDto.paymentMethod,
      transactionId: transaction.transactionId,
      status: 'processed',
    };
  }

  private async getAffiliateBalance(affiliateId: string) {
    const incomes = await this.affiliateIncomeRepository.find({
      where: { affiliateId },
    });

    const availableBalance = incomes
      .filter(i => i.status === 'paid' && i.type !== 'withdrawal')
      .reduce((sum, i) => sum + i.amount, 0);

    return { availableBalance };
  }
}