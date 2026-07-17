import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Affiliate } from '../entities/affiliate.entity';
import { AffiliateLevel } from '../entities/affiliate-level.entity';

@Injectable()
export class AffiliateLevelService {
  constructor(
    @InjectRepository(Affiliate) private affiliateRepository: Repository<Affiliate>,
    @InjectRepository(AffiliateLevel) private levelRepository: Repository<AffiliateLevel>,
  ) {}

  async getCurrentLevel(affiliateId: string): Promise<any> {
    // Seed default levels if none exist
    const levelCount = await this.levelRepository.count();
    if (levelCount === 0) {
      const bronze = this.levelRepository.create({ name: 'Bronze', minReferrals: 0, minEarnings: 0, commissionRate: 0.05 });
      const silver = this.levelRepository.create({ name: 'Silver', minReferrals: 10, minEarnings: 100, commissionRate: 0.07 });
      const gold = this.levelRepository.create({ name: 'Gold', minReferrals: 50, minEarnings: 1000, commissionRate: 0.10 });
      await Promise.all([this.levelRepository.save(bronze), this.levelRepository.save(silver), this.levelRepository.save(gold)]);
    }

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

    const level = await this.levelRepository.findOne({ where: { name: affiliate.level } });

    return {
      currentLevel: affiliate.level,
      levelDetails: level,
    };
  }

  async getLevelRequirements(affiliateId: string): Promise<any> {
    // Seed default levels if none exist
    const levelCount = await this.levelRepository.count();
    if (levelCount === 0) {
      const bronze = this.levelRepository.create({ name: 'Bronze', minReferrals: 0, minEarnings: 0, commissionRate: 0.05 });
      const silver = this.levelRepository.create({ name: 'Silver', minReferrals: 10, minEarnings: 100, commissionRate: 0.07 });
      const gold = this.levelRepository.create({ name: 'Gold', minReferrals: 50, minEarnings: 1000, commissionRate: 0.10 });
      await Promise.all([this.levelRepository.save(bronze), this.levelRepository.save(silver), this.levelRepository.save(gold)]);
    }

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

    const currentLevel = await this.levelRepository.findOne({ where: { name: affiliate.level } });
    if (!currentLevel) {
      return { message: 'Current level data not available' };
    }

    const nextLevel = await this.levelRepository.findOne({ 
      where: { minReferrals: MoreThan(currentLevel.minReferrals) }, 
      order: { minReferrals: 'ASC' } 
    });

    if (!nextLevel) {
      return { message: 'You have reached the highest level' };
    }

    return {
      nextLevel: nextLevel.name,
      requirements: {
        minReferrals: nextLevel.minReferrals,
        minEarnings: nextLevel.minEarnings,
      },
      currentProgress: {
        referrals: affiliate.totalReferrals,
        earnings: affiliate.totalEarnings,
      },
    };
  }

  async getLeaderboard(page: number = 1, limit: number = 10): Promise<any> {
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const affiliates = await this.affiliateRepository.find({
      where: { isActive: true },
      order: { totalEarnings: 'DESC', totalReferrals: 'DESC' },
      skip,
      take: limitNum,
    });

    const total = await this.affiliateRepository.count({ where: { isActive: true } });

    return {
      data: affiliates.map((aff, index) => ({
        rank: skip + index + 1,
        affiliateId: aff.userId,
        totalEarnings: aff.totalEarnings,
        totalReferrals: aff.totalReferrals,
        level: aff.level,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }
}