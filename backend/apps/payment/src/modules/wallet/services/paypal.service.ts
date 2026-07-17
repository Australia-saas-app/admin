import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  private readonly client: paypal.core.PayPalHttpClient;
  private readonly logger = new Logger(PayPalService.name);

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const mode = this.configService.get<string>('PAYPAL_MODE', 'sandbox');

    if (!clientId || !clientSecret) {
      this.logger.warn('PayPal credentials not configured. PayPal integration will not work.');
      return;
    }

    const environment =
      mode === 'live'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    this.client = new paypal.core.PayPalHttpClient(environment);
    this.logger.log(`PayPal initialized in ${mode} mode`);
  }

  /**
   * Create a PayPal order for wallet top-up
   */
  async createOrder(amount: number, currency: string = 'USD', description?: string): Promise<{ orderId: string; approvalUrl: string }> {
    if (!this.client) {
      throw new BadRequestException('PayPal is not configured');
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: description || 'Wallet top-up',
        },
      ],
      application_context: {
        brand_name: 'Vero2',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: this.configService.get<string>('PAYPAL_RETURN_URL', 'http://localhost:3000/wallet/paypal/return'),
        cancel_url: this.configService.get<string>('PAYPAL_CANCEL_URL', 'http://localhost:3000/wallet/paypal/cancel'),
      },
    });

    try {
      const response = await this.client.execute(request);
      const order = response.result;

      const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href;

      if (!approvalUrl) {
        throw new BadRequestException('Failed to get PayPal approval URL');
      }

      return {
        orderId: order.id!,
        approvalUrl,
      };
    } catch (error: any) {
      this.logger.error('PayPal order creation failed', error);
      throw new BadRequestException(`PayPal error: ${error.message}`);
    }
  }

  /**
   * Capture a PayPal order
   */
  async captureOrder(orderId: string): Promise<{ transactionId: string; amount: number; currency: string }> {
    if (!this.client) {
      throw new BadRequestException('PayPal is not configured');
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const response = await this.client.execute(request);
      const order = response.result;

      if (order.status !== 'COMPLETED') {
        throw new BadRequestException(`PayPal order not completed. Status: ${order.status}`);
      }

      const capture = order.purchase_units?.[0]?.payments?.captures?.[0];

      if (!capture) {
        throw new BadRequestException('No capture found in PayPal order');
      }

      return {
        transactionId: capture.id!,
        amount: parseFloat(capture.amount?.value || '0'),
        currency: capture.amount?.currency_code || 'USD',
      };
    } catch (error: any) {
      this.logger.error('PayPal capture failed', error);
      throw new BadRequestException(`PayPal capture error: ${error.message}`);
    }
  }

  /**
   * Refund a PayPal capture
   */
  async refundCapture(captureId: string, amount?: number, currency: string = 'USD'): Promise<{ refundId: string }> {
    if (!this.client) {
      throw new BadRequestException('PayPal is not configured');
    }

    const request = new paypal.payments.CapturesRefundRequest(captureId);
    request.requestBody({
      amount: amount
        ? {
            value: amount.toFixed(2),
            currency_code: currency,
          }
        : undefined,
    });

    try {
      const response = await this.client.execute(request);
      const refund = response.result;

      return {
        refundId: refund.id!,
      };
    } catch (error: any) {
      this.logger.error('PayPal refund failed', error);
      throw new BadRequestException(`PayPal refund error: ${error.message}`);
    }
  }

  /**
   * Verify PayPal webhook signature
   */
  verifyWebhookSignature(headers: Record<string, string>, body: string): boolean {
    // In production, implement proper webhook signature verification
    // This requires storing webhook IDs and verifying signatures
    const webhookId = this.configService.get<string>('PAYPAL_WEBHOOK_ID');
    
    if (!webhookId) {
      this.logger.warn('PayPal webhook ID not configured. Skipping signature verification.');
      return true; // Allow in development
    }

    // TODO: Implement proper PayPal webhook signature verification
    // Use PayPal SDK's verifyWebhookSignature method
    return true;
  }

  /**
   * Check if PayPal is configured
   */
  isConfigured(): boolean {
    return !!this.client;
  }
}

