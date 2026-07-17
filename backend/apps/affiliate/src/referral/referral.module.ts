import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';
import { Referral } from '../entities/referral.entity';
import { Affiliate } from '../entities/affiliate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Referral, Affiliate]),
  ],
  controllers: [ReferralController],
  providers: [ReferralService],
})
export class ReferralModule {}