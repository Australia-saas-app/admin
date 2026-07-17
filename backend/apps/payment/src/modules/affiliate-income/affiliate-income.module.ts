import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateIncomeController, AffiliateReferralsController } from './affiliate-income.controller';
import { AffiliateIncomeService } from './services/affiliate-income.service';
import { AffiliateIncome } from '@/entities/affiliate-income.entity';
import { Transaction } from '@/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AffiliateIncome, Transaction]),
  ],
  controllers: [AffiliateIncomeController, AffiliateReferralsController],
  providers: [AffiliateIncomeService],
  exports: [AffiliateIncomeService],
})
export class AffiliateIncomeModule {}