import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateProfileController } from './profile.controller';
import { AffiliateProfileService } from './profile.service';
import { AffiliateProfile } from '../entities/affiliate-profile.entity';
import { Affiliate } from '../entities/affiliate.entity';
import { Referral } from '../entities/referral.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AffiliateProfile,
      Affiliate,
      Referral,
    ]),
  ],
  controllers: [AffiliateProfileController],
  providers: [AffiliateProfileService],
})
export class ProfileModule {}