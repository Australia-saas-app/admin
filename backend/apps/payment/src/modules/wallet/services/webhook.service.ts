import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from '../../../entities/transaction.entity';
import { Wallet } from '../../../entities/wallet.entity';
import { StripeService } from './stripe.service';
import { PayPalService } from './paypal.service';

export interface WebhookEvent {
  gateway: 'stripe' | 'paypal';
  eventType: string;
  eventData: any;
  rawPayload: string;
  signature?: string;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly stripeService: StripeService,
    private readonly paypalService: PayPalService,
  ) {}

  /**
   * Process webhook event from payment gateway
   */
  async processWebhookEvent(event: WebhookEvent): Promise<{ processed: boolean; transactionId?: string }> {
    try {
      if (event.gateway === 'stripe') {
        return await this.processStripeWebhook(event);
      } else if (event.gateway === 'paypal') {
        return await this.processPayPalWebhook(event);
      } else {
        throw new BadRequestException(`Unsupported gateway: ${event.gateway}`);
      }
    } catch (error) {
      this.logger.error(`Webhook processing failed for ${event.gateway}`, error);
      throw error;
    }
  }

  /**
   * Process Stripe webhook
   */
  private async processStripeWebhook(event: WebhookEvent): Promise<{ processed: boolean; transactionId?: string }> {
    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && event.signature) {
      try {
        this.stripeService.constructEvent(event.rawPayload, event.signature, webhookSecret);
      } catch (error) {
        this.logger.error('Invalid Stripe webhook signature', error);
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    const stripeEvent = event.eventData;

    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        return await this.handleStripePaymentSuccess(stripeEvent.data.object);

      case 'payment_intent.payment_failed':
        return await this.handleStripePaymentFailure(stripeEvent.data.object);

      case 'charge.dispute.created':
        return await this.handleStripeChargeback(stripeEvent.data.object);

      default:
        this.logger.log(`Unhandled Stripe event type: ${stripeEvent.type}`);
        return { processed: false };
    }
  }

  /**
   * Process PayPal webhook
   */
  private async processPayPalWebhook(event: WebhookEvent): Promise<{ processed: boolean; transactionId?: string }> {
    // PayPal webhook verification (simplified)
    if (!this.paypalService.verifyWebhookSignature({}, event.rawPayload)) {
      throw new BadRequestException('Invalid PayPal webhook signature');
    }

    const paypalEvent = event.eventData;

    switch (paypalEvent.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        return await this.handlePayPalPaymentSuccess(paypalEvent.resource);

      case 'PAYMENT.CAPTURE.DENIED':
        return await this.handlePayPalPaymentFailure(paypalEvent.resource);

      default:
        this.logger.log(`Unhandled PayPal event type: ${paypalEvent.event_type}`);
        return { processed: false };
    }
  }

  /**
   * Handle successful Stripe payment
   */
  private async handleStripePaymentSuccess(paymentIntent: any): Promise<{ processed: boolean; transactionId?: string }> {
    const transactionId = paymentIntent.metadata?.internal_transaction_id;

    if (!transactionId) {
      this.logger.warn('Stripe payment success: No internal transaction ID found');
      return { processed: false };
    }

    const transaction = await this.transactionRepository.findOne({
      where: { transactionId },
      relations: ['wallet'],
    });

    if (!transaction) {
      this.logger.error(`Transaction not found: ${transactionId}`);
      return { processed: false };
    }
    if (transaction.status === TransactionStatus.COMPLETED) {
      return { processed: true, transactionId };
    }

    // Update transaction status
    transaction.status = TransactionStatus.COMPLETED;
    transaction.paymentProviderTransactionId = paymentIntent.id;
    transaction.metadata = {
      ...transaction.metadata,
      stripe_payment_intent: paymentIntent,
      completed_at: new Date(),
    };

    // Update wallet balance if it's a deposit
    if (transaction.type === TransactionType.DEPOSIT && transaction.wallet) {
      transaction.wallet.balance = Number(transaction.wallet.balance) + Number(transaction.amount);
      transaction.wallet.availableBalance =
        Number(transaction.wallet.availableBalance || 0) + Number(transaction.amount);
      transaction.balanceAfter = transaction.wallet.balance;
      await this.walletRepository.save(transaction.wallet);
    }

    await this.transactionRepository.save(transaction);

    this.logger.log(`Stripe payment completed: ${transactionId}`);
    return { processed: true, transactionId };
  }

  /**
   * Handle failed Stripe payment
   */
  private async handleStripePaymentFailure(paymentIntent: any): Promise<{ processed: boolean; transactionId?: string }> {
    const transactionId = paymentIntent.metadata?.internal_transaction_id;

    if (!transactionId) {
      return { processed: false };
    }

    const transaction = await this.transactionRepository.findOne({
      where: { transactionId },
    });

    if (!transaction) {
      return { processed: false };
    }

    transaction.status = TransactionStatus.FAILED;
    transaction.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
    transaction.metadata = {
      ...transaction.metadata,
      stripe_payment_intent: paymentIntent,
      failed_at: new Date(),
    };

    await this.transactionRepository.save(transaction);

    this.logger.log(`Stripe payment failed: ${transactionId}`);
    return { processed: true, transactionId };
  }

  /**
   * Handle Stripe chargeback
   */
  private async handleStripeChargeback(dispute: any): Promise<{ processed: boolean; transactionId?: string }> {
    // Find transaction by charge ID
    const transaction = await this.transactionRepository.findOne({
      where: { paymentProviderTransactionId: dispute.charge },
      relations: ['wallet'],
    });

    if (!transaction) {
      return { processed: false };
    }

    // Create chargeback transaction
    const chargebackTransaction = this.transactionRepository.create({
      transactionId: `CHB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      walletId: transaction.walletId,
      userId: transaction.userId,
      type: TransactionType.CHARGEBACK,
      amount: dispute.amount / 100, // Convert from cents
      currency: dispute.currency,
      status: TransactionStatus.COMPLETED,
      description: `Chargeback for transaction ${transaction.transactionId}`,
      paymentProvider: 'stripe',
      paymentProviderTransactionId: dispute.id,
      metadata: { dispute, original_transaction: transaction.transactionId },
    });

    // Deduct from wallet if chargeback wins
    if (transaction.wallet) {
      transaction.wallet.balance -= chargebackTransaction.amount;
      chargebackTransaction.balanceBefore = transaction.wallet.balance + chargebackTransaction.amount;
      chargebackTransaction.balanceAfter = transaction.wallet.balance;
      await this.walletRepository.save(transaction.wallet);
    }

    await this.transactionRepository.save(chargebackTransaction);

    this.logger.log(`Chargeback processed: ${chargebackTransaction.transactionId}`);
    return { processed: true, transactionId: chargebackTransaction.transactionId };
  }

  /**
   * Handle successful PayPal payment
   */
  private async handlePayPalPaymentSuccess(capture: any): Promise<{ processed: boolean; transactionId?: string }> {
    // Similar logic for PayPal
    const transactionId = capture.custom_id;

    if (!transactionId) {
      return { processed: false };
    }

    const transaction = await this.transactionRepository.findOne({
      where: { transactionId },
      relations: ['wallet'],
    });

    if (!transaction) {
      return { processed: false };
    }
    if (transaction.status === TransactionStatus.COMPLETED) {
      return { processed: true, transactionId };
    }

    transaction.status = TransactionStatus.COMPLETED;
    transaction.paymentProviderTransactionId = capture.id;

    if (transaction.type === TransactionType.DEPOSIT && transaction.wallet) {
      transaction.wallet.balance = Number(transaction.wallet.balance) + Number(transaction.amount);
      transaction.wallet.availableBalance =
        Number(transaction.wallet.availableBalance || 0) + Number(transaction.amount);
      transaction.balanceAfter = transaction.wallet.balance;
      await this.walletRepository.save(transaction.wallet);
    }

    await this.transactionRepository.save(transaction);

    return { processed: true, transactionId };
  }

  /**
   * Handle failed PayPal payment
   */
  private async handlePayPalPaymentFailure(capture: any): Promise<{ processed: boolean; transactionId?: string }> {
    const transactionId = capture.custom_id;

    if (!transactionId) {
      return { processed: false };
    }

    const transaction = await this.transactionRepository.findOne({
      where: { transactionId },
    });

    if (!transaction) {
      return { processed: false };
    }

    transaction.status = TransactionStatus.FAILED;
    transaction.failureReason = 'PayPal payment failed';

    await this.transactionRepository.save(transaction);

    return { processed: true, transactionId };
  }
}