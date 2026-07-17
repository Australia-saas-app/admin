import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThan, And } from 'typeorm';
import { Referral } from '../entities/referral.entity';
import { Commission } from '../entities/commission.entity';
import { Affiliate } from '../entities/affiliate.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Referral) private referralRepository: Repository<Referral>,
    @InjectRepository(Commission) private commissionRepository: Repository<Commission>,
    @InjectRepository(Affiliate) private affiliateRepository: Repository<Affiliate>,
  ) {}

  async getAnalyticsOverview(affiliateId: string): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    const totalReferrals = await this.referralRepository.count({ where: { affiliateId: affiliate.id } });
    const totalCommissions = await this.commissionRepository.count({ where: { affiliateId: affiliate.id } });
    const totalEarnings = affiliate?.totalEarnings || 0;

    return {
      totalReferrals,
      totalCommissions,
      totalEarnings,
      currentLevel: affiliate?.level || 'Bronze',
    };
  }

  async getReferralAnalytics(affiliateId: string): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const referrals = await this.referralRepository.find({ where: { affiliateId: affiliate.id } });

    // Simple analytics, can be enhanced
    const statusCounts = referrals.reduce((acc, ref) => {
      acc[ref.status] = (acc[ref.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalReferrals: referrals.length,
      statusBreakdown: statusCounts,
    };
  }

  async getCommissionAnalytics(affiliateId: string): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const commissions = await this.commissionRepository.find({ where: { affiliateId: affiliate.id } });

    const totalAmount = commissions.reduce((sum, com) => sum + Number(com.amount), 0);
    const paidAmount = commissions.filter(c => c.status === 'paid').reduce((sum, com) => sum + Number(com.amount), 0);

    return {
      totalCommissions: commissions.length,
      totalAmount,
      paidAmount,
      pendingAmount: totalAmount - paidAmount,
    };
  }

  async getPerformanceTrends(affiliateId: string, period: string): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    // Simplified, assume period is month, get last 12 months
    const now = new Date();
    const trends = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const referrals = await this.referralRepository.count({
        where: {
          affiliateId: affiliate.id,
          createdAt: And(MoreThanOrEqual(date), LessThan(nextMonth)),
        },
      });

      const commissions = await this.commissionRepository.find({
        where: {
          affiliateId: affiliate.id,
          createdAt: And(MoreThanOrEqual(date), LessThan(nextMonth)),
        },
      });

      const earnings = commissions.reduce((sum, com) => sum + Number(com.amount), 0);

      trends.push({
        period: date.toISOString().slice(0, 7), // YYYY-MM
        referrals,
        commissions: commissions.length,
        earnings,
      });
    }

    return trends;
  }
}