import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  TransactionQueryDto,
  TransactionType,
  TransactionStatus,
} from './dto/transaction-query.dto';
import { IssueRefundDto } from './dto/issue-refund.dto';

@Injectable()
export class PaymentManagementService {
  private readonly logger = new Logger(PaymentManagementService.name);
  private readonly paymentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.paymentServiceUrl = this.configService.get<string>(
      'PAYMENT_SERVICE_URL',
      'http://localhost:3004/api/payment',
    );
  }

  private getHeaders(adminToken?: string) {
    return {
      'Content-Type': 'application/json',
      ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
    };
  }

  async getTransactions(query: TransactionQueryDto, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/admin/transactions`, {
          headers: this.getHeaders(adminToken),
          params: {
            page: query.page || 1,
            limit: query.limit || 20,
            type: query.type,
            status: query.status,
            startDate: query.startDate,
            endDate: query.endDate,
          },
        }),
      );
      
      const { transactions, total, page, limit } = response.data;
      
      return {
        success: true,
        data: {
          transactions,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
          analytics: {
            totalPayment: transactions.filter((t: any) => t.type === TransactionType.PAYMENT).length,
            totalSucceeded: transactions.filter((t: any) => t.status === TransactionStatus.SUCCEEDED).length,
            totalRefunded: transactions.filter((t: any) => t.status === TransactionStatus.REFUNDED).length,
            totalFailed: transactions.filter((t: any) => t.status === TransactionStatus.FAILED).length,
            totalDisputed: transactions.filter((t: any) => t.status === TransactionStatus.DISPUTED).length,
            totalUnacceptable: transactions.filter((t: any) => t.status === TransactionStatus.UNACCEPTABLE).length,
          },
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch transactions: ${error.message}`);
      throw new BadRequestException('Failed to fetch transactions');
    }
  }

  async getTransactionDetails(transactionId: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/admin/transactions/${transactionId}`, {
          headers: this.getHeaders(adminToken),
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Transaction ${transactionId} not found`);
      }
      this.logger.error(`Failed to fetch transaction details: ${error.message}`);
      throw new BadRequestException('Failed to fetch transaction details');
    }
  }

  async getPaymentTransactions(query: TransactionQueryDto, adminToken?: string) {
    const paymentQuery = { ...query, type: TransactionType.PAYMENT };
    return this.getTransactions(paymentQuery, adminToken);
  }

  async getRefundTransactions(query: TransactionQueryDto, adminToken?: string) {
    const refundQuery = { ...query, type: TransactionType.REFUND };
    return this.getTransactions(refundQuery, adminToken);
  }

  async getSuccessPayments(query: TransactionQueryDto, adminToken?: string) {
    const successQuery = {
      ...query,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.SUCCEEDED,
    };
    return this.getTransactions(successQuery, adminToken);
  }

  async getPenaltyPayments(query: TransactionQueryDto, adminToken?: string) {
    const penaltyQuery = {
      ...query,
      type: TransactionType.PAYMENT,
    };
    return this.getTransactions(penaltyQuery, adminToken);
  }

  async getSecurityDeposits(query: TransactionQueryDto, adminToken?: string) {
    const depositQuery = {
      ...query,
      type: TransactionType.PAYMENT,
    };
    return this.getTransactions(depositQuery, adminToken);
  }

  async getProjectDueAmounts(query: TransactionQueryDto, adminToken?: string) {
    const dueQuery = {
      ...query,
      type: TransactionType.PAYMENT,
    };
    return this.getTransactions(dueQuery, adminToken);
  }

  async getProfileAmounts(query: TransactionQueryDto, adminToken?: string) {
    const profileQuery = {
      ...query,
      type: TransactionType.PAYMENT,
    };
    return this.getTransactions(profileQuery, adminToken);
  }

  async issueRefund(
    transactionId: string,
    refundDto: IssueRefundDto,
    adminToken?: string,
  ) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.paymentServiceUrl}/admin/transactions/${transactionId}/refund`,
          refundDto,
          {
            headers: this.getHeaders(adminToken),
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Transaction ${transactionId} not found`);
      }
      const paymentServiceError = error.response?.data?.message || error.message;
      this.logger.error(`Failed to issue refund: ${paymentServiceError}`);
      throw new BadRequestException(paymentServiceError || 'Failed to issue refund');
    }
  }

  async getRefundHistory(transactionId: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.paymentServiceUrl}/admin/transactions/${transactionId}/refund-history`,
          {
            headers: this.getHeaders(adminToken),
          },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Transaction ${transactionId} not found`);
      }
      this.logger.error(`Failed to fetch refund history: ${error.message}`);
      throw new BadRequestException('Failed to fetch refund history');
    }
  }
}
