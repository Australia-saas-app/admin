import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { PayPalService } from './paypal.service';
import { CreateCheckoutSessionDto, CheckoutSessionResponseDto } from '../dto/checkout.dto';

export interface CheckoutSession {
  id: string;
  url: string;
  gateway: 'stripe' | 'paypal';
  amount: number;
  currency: string;
  expiresAt: Date;
  metadata: Record<string, any>;
}

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly paypalService: PayPalService,
  ) {}

  /**
   * Create a checkout session
   */
  async createCheckoutSession(
    dto: CreateCheckoutSessionDto,
    userId: string
  ): Promise<CheckoutSessionResponseDto> {
    const { gateway = 'stripe', currency, items, successUrl, cancelUrl, orderId, customerEmail } = dto;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.unitAmount * (item.quantity || 1));
    }, 0);

    if (totalAmount <= 0) {
      throw new BadRequestException('Total amount must be greater than 0');
    }

    // Set default URLs if not provided
    const defaultSuccessUrl = this.configService.get('CHECKOUT_SUCCESS_URL', 'http://localhost:3000/checkout/success');
    const defaultCancelUrl = this.configService.get('CHECKOUT_CANCEL_URL', 'http://localhost:3000/checkout/cancel');

    const finalSuccessUrl = successUrl || defaultSuccessUrl;
    const finalCancelUrl = cancelUrl || defaultCancelUrl;

    try {
      if (gateway === 'stripe') {
        return await this.createStripeCheckoutSession(
          items,
          totalAmount,
          currency,
          finalSuccessUrl,
          finalCancelUrl,
          userId,
          orderId,
          customerEmail
        );
      } else if (gateway === 'paypal') {
        return await this.createPayPalCheckoutSession(
          items,
          totalAmount,
          currency,
          finalSuccessUrl,
          finalCancelUrl,
          userId,
          orderId
        );
      } else {
        throw new BadRequestException(`Unsupported gateway: ${gateway}`);
      }
    } catch (error) {
      this.logger.error(`Checkout session creation failed for ${gateway}`, error);
      throw error;
    }
  }

  /**
   * Create Stripe checkout session
   */
  private async createStripeCheckoutSession(
    items: any[],
    totalAmount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    userId: string,
    orderId?: string,
    customerEmail?: string
  ): Promise<CheckoutSessionResponseDto> {
    // Create customer if email provided
    let customerId: string | undefined;
    if (customerEmail) {
      const customer = await this.stripeService.createCustomer(customerEmail, undefined, { userId });
      customerId = customer.customerId;
    }

    // Create payment intent for the checkout
    const intent = await this.stripeService.createPaymentIntent(
      totalAmount,
      currency,
      `Checkout for ${items.length} item(s)`,
      {
        userId,
        orderId,
        customerId,
        items: JSON.stringify(items),
      }
    );

    // In a real implementation, you'd create a Stripe Checkout Session
    // For now, return the payment intent info
    return {
      sessionId: intent.paymentIntentId,
      checkoutUrl: `https://checkout.stripe.com/pay/${intent.clientSecret}`,
      gateway: 'stripe',
      amount: totalAmount,
      currency,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };
  }

  /**
   * Create PayPal checkout session
   */
  private async createPayPalCheckoutSession(
    items: any[],
    totalAmount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    userId: string,
    orderId?: string
  ): Promise<CheckoutSessionResponseDto> {
    // Create PayPal order
    const description = `Checkout for ${items.length} item(s)`;
    const order = await this.paypalService.createOrder(totalAmount, currency, description);

    return {
      sessionId: order.orderId,
      checkoutUrl: order.approvalUrl,
      gateway: 'paypal',
      amount: totalAmount,
      currency,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };
  }

  /**
   * Get checkout session details
   */
  async getCheckoutSession(sessionId: string, gateway: 'stripe' | 'paypal' = 'stripe') {
    try {
      if (gateway === 'stripe') {
        const paymentIntent = await this.stripeService.retrievePaymentIntent(sessionId);
        return {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata,
        };
      } else {
        // PayPal session retrieval would require storing order details
        throw new BadRequestException('PayPal session retrieval not implemented');
      }
    } catch (error) {
      this.logger.error(`Checkout session retrieval failed for ${gateway}`, error);
      throw error;
    }
  }

  /**
   * Cancel checkout session
   */
  async cancelCheckoutSession(sessionId: string, gateway: 'stripe' | 'paypal' = 'stripe') {
    try {
      if (gateway === 'stripe') {
        // Retrieve and cancel the payment intent
        const paymentIntent = await this.stripeService.retrievePaymentIntent(sessionId);
        if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'requires_confirmation') {
          // Only cancel if not already processing
          await this.stripeService.cancelPaymentIntent(sessionId);
        }
        return { success: true, message: 'Checkout session cancelled' };
      } else {
        // PayPal cancellation would require API call
        throw new BadRequestException('PayPal session cancellation not implemented');
      }
    } catch (error) {
      this.logger.error(`Checkout session cancellation failed for ${gateway}`, error);
      throw error;
    }
  }
}