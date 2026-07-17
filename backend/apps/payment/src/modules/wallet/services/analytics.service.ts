import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from '../../../entities/transaction.entity';
import { Wallet } from '../../../entities/wallet.entity';

export interface AnalyticsReport {
  period: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalTransactions: number;
    totalVolume: number;
    totalFees: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
  };
  breakdowns: {
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    byCurrency: Record<string, number>;
    byGateway: Record<string, number>;
    byDay: Array<{
      date: string;
      transactions: number;
      volume: number;
    }>;
  };
  topMetrics: {
    topUsers: Array<{
      userId: string;
      transactionCount: number;
      totalVolume: number;
    }>;
    topCurrencies: Array<{
      currency: string;
      transactionCount: number;
      totalVolume: number;
    }>;
  };
}

export interface WalletAnalytics {
  totalWallets: number;
  activeWallets: number;
  totalBalance: number;
  averageBalance: number;
  topWallets: Array<{
    userId: string;
    balance: number;
    transactions: number;
  }>;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  /**
   * Generate comprehensive analytics report
   */
  async generateAnalyticsReport(
    startDate: Date,
    endDate: Date,
    filters?: {
      userId?: string;
      currency?: string;
      status?: TransactionStatus;
      type?: TransactionType;
    }
  ): Promise<AnalyticsReport> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
      .where('transaction.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });

    // Apply filters
    if (filters?.userId) {
      queryBuilder.andWhere('transaction.userId = :userId', { userId: filters.userId });
    }
    if (filters?.currency) {
      queryBuilder.andWhere('transaction.currency = :currency', { currency: filters.currency });
    }
    if (filters?.status) {
      queryBuilder.andWhere('transaction.status = :status', { status: filters.status });
    }
    if (filters?.type) {
      queryBuilder.andWhere('transaction.type = :type', { type: filters.type });
    }

    // Get all transactions for the period
    const transactions = await queryBuilder.getMany();

    // Calculate summary metrics
    const summary = this.calculateSummaryMetrics(transactions);

    // Calculate breakdowns
    const breakdowns = await this.calculateBreakdowns(transactions, startDate, endDate);

    // Get top metrics
    const topMetrics = await this.calculateTopMetrics(transactions);

    return {
      period: { startDate, endDate },
      summary,
      breakdowns,
      topMetrics,
    };
  }

  /**
   * Generate wallet analytics
   */
  async generateWalletAnalytics(): Promise<WalletAnalytics> {
    const wallets = await this.walletRepository.find({
      relations: ['transactions'],
    });

    const totalWallets = wallets.length;
    const activeWallets = wallets.filter(w => w.balance > 0).length;
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const averageBalance = totalWallets > 0 ? totalBalance / totalWallets : 0;

    const topWallets = wallets
      .map(w => ({
        userId: w.userId,
        balance: w.balance,
        transactions: w.transactions?.length || 0,
      }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    return {
      totalWallets,
      activeWallets,
      totalBalance,
      averageBalance,
      topWallets,
    };
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRevenue: number;
    revenueByMonth: Array<{ month: string; revenue: number }>;
    revenueByCurrency: Record<string, number>;
    feesCollected: number;
  }> {
    const transactions = await this.transactionRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        status: TransactionStatus.COMPLETED,
        type: TransactionType.PAYMENT,
      },
    });

    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Group by month
    const revenueByMonth = this.groupByMonth(transactions);

    // Group by currency
    const revenueByCurrency = transactions.reduce((acc, tx) => {
      acc[tx.currency] = (acc[tx.currency] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    // Calculate fees (simplified - in reality, fees would be stored separately)
    const feesCollected = totalRevenue * 0.029; // 2.9% fee

    return {
      totalRevenue,
      revenueByMonth,
      revenueByCurrency,
      feesCollected,
    };
  }

  /**
   * Get fraud analytics
   */
  async getFraudAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalTransactions: number;
    suspiciousTransactions: number;
    fraudRate: number;
    blockedTransactions: number;
    topFraudReasons: Array<{ reason: string; count: number }>;
  }> {
    const transactions = await this.transactionRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    const totalTransactions = transactions.length;

    // Count suspicious transactions (those with fraud flags in metadata)
    const suspiciousTransactions = transactions.filter(tx =>
      tx.metadata && typeof tx.metadata === 'object' &&
      Object.keys(tx.metadata).some(key => key.toLowerCase().includes('fraud'))
    ).length;

    const fraudRate = totalTransactions > 0 ? (suspiciousTransactions / totalTransactions) * 100 : 0;

    // Count blocked transactions (failed due to fraud)
    const blockedTransactions = transactions.filter(tx =>
      tx.status === TransactionStatus.FAILED &&
      tx.failureReason?.toLowerCase().includes('fraud')
    ).length;

    // Top fraud reasons (simplified)
    const topFraudReasons = [
      { reason: 'Velocity Check', count: Math.floor(suspiciousTransactions * 0.4) },
      { reason: 'Amount Anomaly', count: Math.floor(suspiciousTransactions * 0.3) },
      { reason: 'Geographic Anomaly', count: Math.floor(suspiciousTransactions * 0.2) },
      { reason: 'IP Block', count: Math.floor(suspiciousTransactions * 0.1) },
    ];

    return {
      totalTransactions,
      suspiciousTransactions,
      fraudRate: Math.round(fraudRate * 100) / 100,
      blockedTransactions,
      topFraudReasons,
    };
  }

  private calculateSummaryMetrics(transactions: Transaction[]) {
    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const successfulTransactions = transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length;
    const failedTransactions = transactions.filter(tx => tx.status === TransactionStatus.FAILED).length;
    const pendingTransactions = transactions.filter(tx => tx.status === TransactionStatus.PENDING).length;

    // Calculate fees (simplified)
    const totalFees = totalVolume * 0.029; // 2.9% fee

    return {
      totalTransactions,
      totalVolume,
      totalFees,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
    };
  }

  private async calculateBreakdowns(transactions: Transaction[], startDate: Date, endDate: Date) {
    // Status breakdown
    const byStatus = transactions.reduce((acc, tx) => {
      acc[tx.status] = (acc[tx.status] || 0) + 1;
      return acc;
    }, {} as Record<TransactionStatus, number>);

    // Type breakdown
    const byType = transactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {} as Record<TransactionType, number>);

    // Currency breakdown
    const byCurrency = transactions.reduce((acc, tx) => {
      acc[tx.currency] = (acc[tx.currency] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    // Gateway breakdown
    const byGateway = transactions.reduce((acc, tx) => {
      const gateway = tx.paymentProvider || 'unknown';
      acc[gateway] = (acc[gateway] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Daily breakdown
    const byDay = await this.getDailyBreakdown(startDate, endDate);

    return {
      byStatus,
      byType,
      byCurrency,
      byGateway,
      byDay,
    };
  }

  private async getDailyBreakdown(startDate: Date, endDate: Date) {
    const dailyStats = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select("DATE(transaction.createdAt)", 'date')
      .addSelect('COUNT(*)', 'transactions')
      .addSelect('SUM(transaction.amount)', 'volume')
      .where('transaction.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy("DATE(transaction.createdAt)")
      .orderBy("DATE(transaction.createdAt)", 'ASC')
      .getRawMany();

    return dailyStats.map(stat => ({
      date: stat.date,
      transactions: parseInt(stat.transactions),
      volume: parseFloat(stat.volume) || 0,
    }));
  }

  private async calculateTopMetrics(transactions: Transaction[]) {
    // Top users by transaction count and volume
    const userStats = transactions.reduce((acc, tx) => {
      if (!acc[tx.userId]) {
        acc[tx.userId] = { transactionCount: 0, totalVolume: 0 };
      }
      acc[tx.userId].transactionCount++;
      acc[tx.userId].totalVolume += tx.amount;
      return acc;
    }, {} as Record<string, { transactionCount: number; totalVolume: number }>);

    const topUsers = Object.entries(userStats)
      .map(([userId, stats]) => ({ userId, transactionCount: stats.transactionCount, totalVolume: stats.totalVolume }))
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 10);

    // Top currencies
    const currencyStats = transactions.reduce((acc, tx) => {
      if (!acc[tx.currency]) {
        acc[tx.currency] = { transactionCount: 0, totalVolume: 0 };
      }
      acc[tx.currency].transactionCount++;
      acc[tx.currency].totalVolume += tx.amount;
      return acc;
    }, {} as Record<string, { transactionCount: number; totalVolume: number }>);

    const topCurrencies = Object.entries(currencyStats)
      .map(([currency, stats]) => ({ currency, transactionCount: stats.transactionCount, totalVolume: stats.totalVolume }))
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 5);

    return {
      topUsers,
      topCurrencies,
    };
  }

  private groupByMonth(transactions: Transaction[]) {
    const monthlyData = transactions.reduce((acc, tx) => {
      const month = tx.createdAt.toISOString().substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue: revenue as number }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}