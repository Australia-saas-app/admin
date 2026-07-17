import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WalletController } from './wallet.controller';
import { WebhookController } from './webhook.controller';
import { PaymentsController } from './payments.controller';
import { WithdrawalsController } from './withdrawals.controller';
import { WalletService } from './wallet.service';
import { Wallet } from '../../entities/wallet.entity';
import { PaymentCard } from '../../entities/payment-card.entity';
import { Transaction } from '../../entities/transaction.entity';
import { WithdrawalRequest } from '../../entities/withdrawal-request.entity';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PayPalService } from './services/paypal.service';
import { StripeService } from './services/stripe.service';
import { PaymentGatewayService } from './services/payment-gateway.service';
import { CurrencyService } from './services/currency.service';
import { WebhookService } from './services/webhook.service';
import { CheckoutService } from './services/checkout.service';
import { FraudDetectionService } from './services/fraud-detection.service';
import { AnalyticsService } from './services/analytics.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, PaymentCard, Transaction, WithdrawalRequest, User]),
    ConfigModule, // ConfigModule is global, but explicit import for clarity
  ],
  controllers: [WalletController, WebhookController, PaymentsController, WithdrawalsController],
  providers: [WalletService, PayPalService, StripeService, PaymentGatewayService, CurrencyService, WebhookService, CheckoutService, FraudDetectionService, AnalyticsService, JwtAuthGuard, AdminAuthGuard],
  exports: [WalletService, PayPalService, StripeService, PaymentGatewayService, CurrencyService, WebhookService, CheckoutService, FraudDetectionService, AnalyticsService],
})
export class WalletModule {}

