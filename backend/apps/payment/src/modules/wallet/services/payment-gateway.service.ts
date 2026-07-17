import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { PayPalService } from './paypal.service';
import { FraudDetectionService } from './fraud-detection.service';
import { Request } from 'express';

export interface PaymentGatewayResult {
  gateway: 'stripe' | 'paypal';
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  gatewayResponse?: any;
}

export interface RefundResult {
  gateway: 'stripe' | 'paypal';
  refundId: string;
  amount?: number;
  status: string;
}

@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);
  private readonly defaultGateway: 'stripe' | 'paypal';

  constructor(
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly paypalService: PayPalService,
    private readonly fraudDetectionService: FraudDetectionService,
  ) {
    this.defaultGateway = this.configService.get('DEFAULT_PAYMENT_GATEWAY', 'stripe');
  }

  /**
   * Process a payment using the preferred gateway
   */
  async processPayment(
    amount: number,
    currency: string = 'USD',
    paymentMethod: string,
    description?: string,
    metadata?: Record<string, any>,
    userId?: string,
    request?: Request
  ): Promise<PaymentGatewayResult> {
    // Perform fraud check if userId and request are provided
    if (userId && request) {
      const fraudCheck = await this.fraudDetectionService.checkTransaction(
        userId,
        amount,
        currency,
        request,
        'payment'
      );

      if (fraudCheck.recommendedAction === 'block') {
        throw new BadRequestException('Payment blocked due to security concerns');
      }

      if (fraudCheck.recommendedAction === 'challenge') {
        // In a real implementation, you'd trigger 3D Secure or additional verification
        this.logger.warn(`Payment challenged for user ${userId}: ${fraudCheck.reasons.join(', ')}`);
      }
    }

    const gateway = this.selectGateway();

    try {
      if (gateway === 'stripe') {
        return await this.processStripePayment(amount, currency, paymentMethod, description, metadata);
      } else {
        return await this.processPayPalPayment(amount, currency, paymentMethod, description, metadata);
      }
    } catch (error) {
      this.logger.error(`Payment processing failed with ${gateway}`, error);
      throw error;
    }
  }

  /**
   * Process refund using the appropriate gateway
   */
  async processRefund(
    transactionId: string,
    amount?: number,
    gateway?: 'stripe' | 'paypal'
  ): Promise<RefundResult> {
    const targetGateway = gateway || this.defaultGateway;

    try {
      if (targetGateway === 'stripe') {
        const result = await this.stripeService.createRefund(transactionId, amount);
        return {
          gateway: 'stripe',
          refundId: result.refundId,
          amount,
          status: 'processed',
        };
      } else {
        const result = await this.paypalService.refundCapture(transactionId, amount);
        return {
          gateway: 'paypal',
          refundId: result.refundId,
          amount,
          status: 'processed',
        };
      }
    } catch (error) {
      this.logger.error(`Refund processing failed with ${targetGateway}`, error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string, gateway?: 'stripe' | 'paypal'): Promise<{ status: string; details?: any }> {
    const targetGateway = gateway || this.defaultGateway;

    try {
      if (targetGateway === 'stripe') {
        const paymentIntent = await this.stripeService.retrievePaymentIntent(transactionId);
        return {
          status: paymentIntent.status,
          details: paymentIntent,
        };
      } else {
        // PayPal doesn't have a direct status check, would need to store order details
        throw new BadRequestException('PayPal status checking not implemented');
      }
    } catch (error) {
      this.logger.error(`Payment status check failed with ${targetGateway}`, error);
      throw error;
    }
  }

  private selectGateway(): 'stripe' | 'paypal' {
    // For now, use default. Could implement intelligent routing based on currency, amount, etc.
    return this.defaultGateway;
  }

  private async processStripePayment(
    amount: number,
    currency: string,
    paymentMethod: string,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<PaymentGatewayResult> {
    // Create payment intent
    const intent = await this.stripeService.createPaymentIntent(amount, currency, description, metadata);

    // Confirm payment (in real implementation, this would be done client-side)
    const confirmation = await this.stripeService.confirmPaymentIntent(intent.paymentIntentId, paymentMethod);

    return {
      gateway: 'stripe',
      transactionId: intent.paymentIntentId,
      amount: confirmation.amount,
      currency: confirmation.currency,
      status: confirmation.status,
      gatewayResponse: { intent, confirmation },
    };
  }

  private async processPayPalPayment(
    amount: number,
    currency: string,
    paymentMethod: string,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<PaymentGatewayResult> {
    // Create order
    const order = await this.paypalService.createOrder(amount, currency, description);

    // Capture order (in real implementation, this would be done after approval)
    const capture = await this.paypalService.captureOrder(order.orderId);

    return {
      gateway: 'paypal',
      transactionId: capture.transactionId,
      amount: capture.amount,
      currency: capture.currency,
      status: 'completed',
      gatewayResponse: { order, capture },
    };
  }
}