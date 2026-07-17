import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDeposit } from '@/entities/security-deposit.entity';
import { Transaction, TransactionType, TransactionStatus } from '@/entities/transaction.entity';
import { PaySecurityDepositDto } from '../dto/pay-deposit.dto';
import { RequestSecurityDepositRefundDto } from '../dto/refund-request.dto';
import { SecurityDepositHistoryQueryDto } from '../dto/history-query.dto';

@Injectable()
export class SecurityDepositService {
  constructor(
    @InjectRepository(SecurityDeposit)
    private readonly securityDepositRepository: Repository<SecurityDeposit>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async payDeposit(agencyId: string, payDto: PaySecurityDepositDto) {
    // TODO: Integrate with payment processor (Stripe/PayPal)
    // For now, create deposit record and transaction
    const deposit = this.securityDepositRepository.create({
      agencyId,
      amount: payDto.amount,
      currency: payDto.currency,
      paymentDate: new Date(),
      transactionId: `deposit_${Date.now()}_${agencyId}`,
    });

    await this.securityDepositRepository.save(deposit);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      userId: agencyId,
      amount: payDto.amount,
      currency: payDto.currency,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      description: 'Security deposit payment',
      transactionId: deposit.transactionId,
    });

    await this.transactionRepository.save(transaction);

    return {
      depositId: deposit.id,
      transactionId: transaction.transactionId,
      amount: payDto.amount,
      currency: payDto.currency,
      status: 'pending_payment_confirmation', // Would be updated by webhook
    };
  }

  async getDepositStatus(agencyId: string) {
    const deposits = await this.securityDepositRepository.find({
      where: { agencyId },
      order: { createdAt: 'DESC' },
    });

    if (deposits.length === 0) {
      return {
        totalDeposit: 0,
        currentBalance: 0,
        dueAmount: 0,
        lastPaymentDate: null,
        penalties: 0,
      };
    }

    const totalDeposit = deposits
      .filter(d => d.status === 'paid' || d.status === 'partial_refund')
      .reduce((sum, d) => sum + d.amount, 0);

    const refunded = deposits
      .filter(d => d.status === 'refunded' || d.status === 'partial_refund')
      .reduce((sum, d) => sum + d.amount, 0);

    const currentBalance = totalDeposit - refunded;
    const lastPayment = deposits.find(d => d.status === 'paid');

    return {
      totalDeposit,
      currentBalance,
      dueAmount: Math.max(0, currentBalance), // Assuming minimum deposit required
      lastPaymentDate: lastPayment?.paymentDate || null,
      penalties: 0, // TODO: Implement penalty calculation
    };
  }

  async requestRefund(agencyId: string, refundDto: RequestSecurityDepositRefundDto) {
    const status = await this.getDepositStatus(agencyId);

    if (status.currentBalance < refundDto.amount) {
      throw new BadRequestException('Insufficient deposit balance for refund');
    }

    // TODO: Create refund request record and notify admin
    // For now, return confirmation
    return {
      requestId: `refund_${Date.now()}`,
      amount: refundDto.amount,
      reason: refundDto.reason,
      status: 'pending_admin_approval',
    };
  }

  async getDepositHistory(agencyId: string, query: SecurityDepositHistoryQueryDto) {
    const { page = 1, limit = 10, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.securityDepositRepository.createQueryBuilder('deposit')
      .where('deposit.agency_id = :agencyId', { agencyId });

    if (startDate) {
      queryBuilder.andWhere('deposit.created_at >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere('deposit.created_at <= :endDate', { endDate: new Date(endDate) });
    }

    const [deposits, total] = await queryBuilder
      .orderBy('deposit.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      deposits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}