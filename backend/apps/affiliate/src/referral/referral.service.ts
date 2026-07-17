import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity';
import { Affiliate } from '../entities/affiliate.entity';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral) private referralRepository: Repository<Referral>,
    @InjectRepository(Affiliate) private affiliateRepository: Repository<Affiliate>,
  ) {}

  async getReferralCode(affiliateId: string): Promise<{ referralCode: string }> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    return { referralCode: affiliate.referralCode };
  }

  async getReferrals(affiliateId: string, page: number = 1, limit: number = 20): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const [referrals, total] = await this.referralRepository.findAndCount({
      where: { affiliateId: affiliate.id },
      order: { createdAt: 'DESC' },
      skip,
      take: limitNum,
    });

    return {
      data: referrals,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getReferralDetails(referralId: string, affiliateId: string): Promise<Referral> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    // Check if referralId is a UUID or a referralCode
    let referral:any;
    if (referralId.includes('-') && referralId.length === 36) {
      // It's a UUID
      
      referral = await this.referralRepository.findOne({ where: { id: referralId, affiliateId: affiliate.id } });
    } else {
      // It's a referralCode
      referral = await this.referralRepository.findOne({ where: { referralCode: referralId } });
    }
    
    if (!referral) {
      throw new NotFoundException('Referral not found');
    }
    return referral;
  }

  async getReferralStats(affiliateId: string): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const totalReferrals = await this.referralRepository.count({ where: { affiliateId: affiliate.id } });
    const completedReferrals = await this.referralRepository.count({ where: { affiliateId: affiliate.id, status: 'completed' } });
    const pendingReferrals = await this.referralRepository.count({ where: { affiliateId: affiliate.id, status: 'pending' } });

    const completedReferralsData = await this.referralRepository.find({
      where: { affiliateId: affiliate.id, status: 'completed' },
      select: ['commissionEarned']
    });

    const totalCommission = completedReferralsData.reduce((sum, referral) => sum + (referral.commissionEarned || 0), 0);

    return {
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      totalCommissionEarned: totalCommission,
    };
  }

  async findAffiliateByReferralCode(referralCode: string): Promise<Affiliate> {
    const affiliate = await this.affiliateRepository.findOne({ where: { referralCode } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found for referral code');
    }
    return affiliate;
  }

  async createReferral(affiliateId: string, referredUserId: string, referralCode: string): Promise<Referral> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    const referral = this.referralRepository.create({
      affiliateId: affiliate.id,
      referredUserId,
      referralCode,
      status: 'pending',
      commissionEarned: 0,
    });

    return await this.referralRepository.save(referral);
  }

  async completeReferral(referralId: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({ where: { id: referralId } });
    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    referral.status = 'completed';
    // Assume commission is calculated elsewhere
    return await this.referralRepository.save(referral);
  }
}