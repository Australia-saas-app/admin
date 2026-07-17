import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      this.logger.warn('Stripe secret key not configured. Stripe integration will not work.');
      return;
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as any,
    });

    this.logger.log('Stripe initialized');
  }

  /**
   * Create a Stripe payment intent for wallet top-up
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'USD',
    description?: string,
    metadata?: Record<string, string>
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        description,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      this.logger.error('Stripe payment intent creation failed', error);
      throw new BadRequestException(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Confirm a Stripe payment intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<{ status: string; amount: number; currency: string }> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
      };
    } catch (error: any) {
      this.logger.error('Stripe payment confirmation failed', error);
      throw new BadRequestException(`Stripe confirmation error: ${error.message}`);
    }
  }

  /**
   * Retrieve a payment intent
   */
  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error: any) {
      this.logger.error('Stripe payment intent retrieval failed', error);
      throw new BadRequestException(`Stripe retrieval error: ${error.message}`);
    }
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ refundId: string }> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as Stripe.RefundCreateParams.Reason,
      });

      return {
        refundId: refund.id,
      };
    } catch (error: any) {
      this.logger.error('Stripe refund creation failed', error);
      throw new BadRequestException(`Stripe refund error: ${error.message}`);
    }
  }

  /**
   * Create a customer
   */
  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<{ customerId: string }> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata,
      });

      return {
        customerId: customer.id,
      };
    } catch (error: any) {
      this.logger.error('Stripe customer creation failed', error);
      throw new BadRequestException(`Stripe customer error: ${error.message}`);
    }
  }

  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<void> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (error: any) {
      this.logger.error('Stripe payment method attachment failed', error);
      throw new BadRequestException(`Stripe attachment error: ${error.message}`);
    }
  }

  /**
   * Handle Stripe webhooks
   */
  constructEvent(payload: string | Buffer, signature: string, webhookSecret: string): Stripe.Event {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error: any) {
      this.logger.error('Stripe webhook signature verification failed', error);
      throw new BadRequestException(`Webhook error: ${error.message}`);
    }
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    try {
      await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error: any) {
      this.logger.error('Stripe payment intent cancellation failed', error);
      throw new BadRequestException(`Stripe cancellation error: ${error.message}`);
    }
  }

  /**
   * Check if Stripe is configured
   */
  isConfigured(): boolean {
    return !!this.stripe;
  }
}