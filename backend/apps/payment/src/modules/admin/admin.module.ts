import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';
import { SecurityDeposit } from '@/entities/security-deposit.entity';
import { AffiliateIncome } from '@/entities/affiliate-income.entity';
import { Transaction } from '@/entities/transaction.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityDeposit, AffiliateIncome, Transaction]),
    WalletModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}