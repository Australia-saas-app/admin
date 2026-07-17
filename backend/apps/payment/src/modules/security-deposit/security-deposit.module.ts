import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityDepositController } from './security-deposit.controller';
import { SecurityDepositService } from './services/security-deposit.service';
import { SecurityDeposit } from '@/entities/security-deposit.entity';
import { Transaction } from '@/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityDeposit, Transaction]),
  ],
  controllers: [SecurityDepositController],
  providers: [SecurityDepositService],
  exports: [SecurityDepositService],
})
export class SecurityDepositModule {}