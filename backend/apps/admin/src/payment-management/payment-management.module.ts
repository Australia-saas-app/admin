import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PaymentManagementController } from './payment-management.controller';
import { PaymentManagementService } from './payment-management.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [PaymentManagementController],
  providers: [PaymentManagementService],
  exports: [PaymentManagementService],
})
export class PaymentManagementModule {}

