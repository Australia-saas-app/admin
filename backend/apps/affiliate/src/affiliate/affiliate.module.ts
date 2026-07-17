import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateController } from './affiliate.controller';
import { AffiliateService } from './affiliate.service';
import { Affiliate } from '../entities/affiliate.entity';
import { Withdrawal } from '../entities/withdrawal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Affiliate, Withdrawal]),
  ],
  controllers: [AffiliateController],
  providers: [AffiliateService],
})
export class AffiliateModule {}