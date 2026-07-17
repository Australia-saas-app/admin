import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Affiliate } from '../entities/affiliate.entity';
import { WalletTransaction } from '../entities/wallet-transaction.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Affiliate, WalletTransaction]),
    AuthModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}