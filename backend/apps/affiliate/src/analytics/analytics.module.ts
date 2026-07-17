import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Referral } from '../entities/referral.entity';
import { Commission } from '../entities/commission.entity';
import { Affiliate } from '../entities/affiliate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Referral,
      Commission,
      Affiliate,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}