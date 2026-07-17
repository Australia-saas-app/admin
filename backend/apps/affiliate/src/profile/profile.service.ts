import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AffiliateProfile } from "../entities/affiliate-profile.entity";
import { Affiliate } from "../entities/affiliate.entity";
import { Referral } from "../entities/referral.entity";

@Injectable()
export class AffiliateProfileService {
  constructor(
    @InjectRepository(AffiliateProfile)
    private profileRepository: Repository<AffiliateProfile>,
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
  ) {}

  async getAffiliateProfile(affiliateId: string): Promise<AffiliateProfile> {
    const profile = await this.profileRepository.findOne({
      where: { userId: affiliateId },
    });
    if (!profile) {
      throw new NotFoundException("Profile not found");
    }
    return profile;
  }

  async signUpForAffiliateProgram(
    affiliateId: string,
    termsAccepted: boolean,
    referralCode?: string,
  ): Promise<any> {
    if (!termsAccepted) {
      throw new ConflictException("Terms must be accepted");
    }
    let referralCodeGenerated: string = "";
    let affiliate = await this.affiliateRepository.findOne({
      where: { userId: affiliateId },
    });
    if (!affiliate) {
      // Generate referral code
      referralCodeGenerated = `REF${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      affiliate = this.affiliateRepository.create({
        userId: affiliateId,
        referralCode: referralCodeGenerated,
      });
      await this.affiliateRepository.save(affiliate);
    }

    let profile = await this.profileRepository.findOne({
      where: { userId: affiliateId },
    });
    if (!profile) {
      profile = this.profileRepository.create({
        userId: affiliateId,
      });
      await this.profileRepository.save(profile);
    }

    // If a referral code was provided, create a referral record
    if (referralCode && referralCode.trim() !== '') {
      const referrer = await this.affiliateRepository.findOne({
        where: { referralCode: referralCode },
      });
      if (referrer) {
        // Check if referral already exists
        const existingReferral = await this.referralRepository.findOne({
          where: { referredUserId: affiliateId },
        });

        if (!existingReferral) {
          const referral = this.referralRepository.create({
            affiliateId: referrer.id,
            referredUserId: affiliateId,
            referralCode,
            status: "pending",
            commissionEarned: 0,
          });
          await this.referralRepository.save(referral);

          // Update referrer's totalReferrals
          referrer.totalReferrals += 1;
          await this.affiliateRepository.save(referrer);
        }
      } else {
        const referral = this.referralRepository.create({
          affiliateId: affiliate.id,
          referredUserId: affiliateId,
          referralCode: referralCodeGenerated,
          status: "pending",
          commissionEarned: 0,
        });
        await this.referralRepository.save(referral);

        // Update referrer's totalReferrals
        affiliate.totalReferrals += 1;
        await this.affiliateRepository.save(affiliate);
      }
    }
    if (!referralCode && referralCodeGenerated) {
      const referral = this.referralRepository.create({
        affiliateId: affiliate.id,
        referredUserId: affiliateId,
        referralCode: referralCodeGenerated,
        status: "pending",
        commissionEarned: 0,
      });
      await this.referralRepository.save(referral);

      // Update referrer's totalReferrals
      affiliate.totalReferrals += 1;
      await this.affiliateRepository.save(affiliate);
    }

    return { affiliate, profile };
  }

  async updateAffiliateProfile(
    affiliateId: string,
    updates: { displayName?: string; bio?: string; socialLinks?: any },
  ): Promise<AffiliateProfile> {
    const profile = await this.profileRepository.findOne({
      where: { userId: affiliateId },
    });
    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    if (updates.displayName !== undefined) {
      profile.displayName = updates.displayName;
    }
    if (updates.bio !== undefined) {
      profile.bio = updates.bio;
    }
    if (updates.socialLinks !== undefined) {
      profile.socialLinks = { ...profile.socialLinks, ...updates.socialLinks };
    }

    return this.profileRepository.save(profile);
  }
}
