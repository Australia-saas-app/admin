import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Transaction, TransactionStatus } from '../../../entities/transaction.entity';
import { Request } from 'express';

export interface FraudCheckResult {
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
  recommendedAction: 'allow' | 'block' | 'review' | 'challenge';
}

export interface FraudAlert {
  id: string;
  type: 'velocity_check' | 'amount_anomaly' | 'geographic_anomaly' | 'device_fingerprint' | 'ip_block';
  severity: 'low' | 'medium' | 'high';
  userId: string;
  transactionId?: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
}

@Injectable()
export class FraudDetectionService {
  private readonly logger = new Logger(FraudDetectionService.name);
  private blockedIPs = new Set<string>();
  private velocityCache = new Map<string, { count: number; windowStart: number }>();
  private readonly velocityWindow = 60 * 1000; // 1 minute
  private readonly maxRequestsPerMinute = 10;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * Perform comprehensive fraud check on a transaction
   */
  async checkTransaction(
    userId: string,
    amount: number,
    currency: string,
    request: Request,
    transactionType: string = 'payment'
  ): Promise<FraudCheckResult> {
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let recommendedAction: 'allow' | 'block' | 'review' | 'challenge' = 'allow';

    // 1. IP-based checks
    const ipCheck = this.checkIP(request.ip);
    if (!ipCheck.allowed) {
      reasons.push('IP address is blocked');
      riskLevel = 'high';
      recommendedAction = 'block';
      return { isSuspicious: true, riskLevel, reasons, recommendedAction };
    }

    // 2. Velocity checks
    const velocityCheck = await this.checkVelocity(userId, request.ip);
    if (!velocityCheck.allowed) {
      reasons.push(`Too many requests: ${velocityCheck.count} in ${this.velocityWindow / 1000}s`);
      riskLevel = 'high';
      recommendedAction = 'block';
    }

    // 3. Amount anomaly check
    const amountCheck = await this.checkAmountAnomaly(userId, amount, currency);
    if (amountCheck.isAnomalous) {
      reasons.push(`Unusual amount: ${amount} ${currency} (avg: ${amountCheck.averageAmount})`);
      if (riskLevel === 'low') riskLevel = 'medium';
      if (recommendedAction === 'allow') recommendedAction = 'review';
    }

    // 4. Geographic anomaly check
    const geoCheck = await this.checkGeographicAnomaly(userId, request);
    if (geoCheck.isAnomalous) {
      reasons.push(`Unusual location: ${geoCheck.currentCountry} (usual: ${geoCheck.usualCountry})`);
      if (riskLevel === 'low') riskLevel = 'medium';
      if (recommendedAction === 'allow') recommendedAction = 'challenge';
    }

    // 5. Transaction type specific checks
    if (transactionType === 'withdrawal' && amount > 5000) {
      reasons.push('Large withdrawal amount requires review');
      if (riskLevel === 'low') riskLevel = 'medium';
      if (recommendedAction === 'allow') recommendedAction = 'review';
    }

    const isSuspicious = reasons.length > 0;

    // Log fraud check result
    this.logger.log(`Fraud check for user ${userId}: ${isSuspicious ? 'SUSPICIOUS' : 'CLEAN'} - ${reasons.join(', ')}`);

    if (isSuspicious) {
      await this.createFraudAlert({
        type: 'velocity_check',
        severity: riskLevel,
        userId,
        details: {
          reasons,
          riskLevel,
          recommendedAction,
          amount,
          currency,
          ip: request.ip,
          userAgent: request.get('User-Agent'),
        },
      });
    }

    return {
      isSuspicious,
      riskLevel,
      reasons,
      recommendedAction,
    };
  }

  /**
   * Check if IP is blocked
   */
  private checkIP(ip: string): { allowed: boolean } {
    return { allowed: !this.blockedIPs.has(ip) };
  }

  /**
   * Block an IP address
   */
  blockIP(ip: string): void {
    this.blockedIPs.add(ip);
    this.logger.warn(`IP address blocked: ${ip}`);
  }

  /**
   * Unblock an IP address
   */
  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    this.logger.log(`IP address unblocked: ${ip}`);
  }

  /**
   * Check request velocity
   */
  private checkVelocity(userId: string, ip: string): { allowed: boolean; count: number } {
    const key = `${userId}:${ip}`;
    const now = Date.now();
    const windowData = this.velocityCache.get(key);

    if (!windowData || (now - windowData.windowStart) > this.velocityWindow) {
      // Start new window
      this.velocityCache.set(key, { count: 1, windowStart: now });
      return { allowed: true, count: 1 };
    }

    windowData.count++;

    if (windowData.count > this.maxRequestsPerMinute) {
      return { allowed: false, count: windowData.count };
    }

    return { allowed: true, count: windowData.count };
  }

  /**
   * Check for unusual transaction amounts
   */
  private async checkAmountAnomaly(
    userId: string,
    amount: number,
    currency: string
  ): Promise<{ isAnomalous: boolean; averageAmount: number }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userTransactions = await this.transactionRepository.find({
      where: {
        userId,
        currency,
        createdAt: MoreThan(thirtyDaysAgo),
        status: TransactionStatus.COMPLETED,
      },
    });

    if (userTransactions.length < 3) {
      return { isAnomalous: false, averageAmount: 0 };
    }

    const averageAmount = userTransactions.reduce((sum, tx) => sum + tx.amount, 0) / userTransactions.length;
    const isAnomalous = Math.abs(amount - averageAmount) / averageAmount > 2; // 200% deviation

    return { isAnomalous, averageAmount };
  }

  /**
   * Check for geographic anomalies
   */
  private async checkGeographicAnomaly(
    userId: string,
    request: Request
  ): Promise<{ isAnomalous: boolean; currentCountry: string; usualCountry: string }> {
    // This would require IP geolocation service
    // For now, return a placeholder implementation
    const currentCountry = this.getCountryFromIP(request.ip);

    // In a real implementation, you'd check user's historical transaction countries
    const usualCountry = 'US'; // Placeholder

    const isAnomalous = currentCountry !== usualCountry;

    return { isAnomalous, currentCountry, usualCountry };
  }

  /**
   * Get country from IP (placeholder implementation)
   */
  private getCountryFromIP(ip: string): string {
    // In production, use a service like MaxMind GeoIP
    return 'US'; // Placeholder
  }

  /**
   * Create fraud alert
   */
  private async createFraudAlert(alert: Omit<FraudAlert, 'id' | 'timestamp' | 'resolved'>): Promise<void> {
    const fraudAlert: FraudAlert = {
      ...alert,
      id: `fraud_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false,
    };

    // In a real implementation, you'd store this in a database
    this.logger.warn(`Fraud alert created: ${JSON.stringify(fraudAlert)}`);
  }

  /**
   * Get fraud statistics
   */
  async getFraudStatistics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<any> {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const suspiciousTransactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt > :startDate', { startDate })
      .andWhere('transaction.metadata::text LIKE :fraudFlag', { fraudFlag: '%fraud%' })
      .getCount();

    const totalTransactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt > :startDate', { startDate })
      .getCount();

    const fraudRate = totalTransactions > 0 ? (suspiciousTransactions / totalTransactions) * 100 : 0;

    return {
      timeframe,
      totalTransactions,
      suspiciousTransactions,
      fraudRate: Math.round(fraudRate * 100) / 100,
      blockedIPs: this.blockedIPs.size,
    };
  }
}