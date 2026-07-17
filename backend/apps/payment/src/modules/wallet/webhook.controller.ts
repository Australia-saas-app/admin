import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhookService, WebhookEvent } from './services/webhook.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripe')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleStripeWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, string>,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const event: WebhookEvent = {
      gateway: 'stripe',
      eventType: body.type,
      eventData: body,
      rawPayload: req.rawBody ? req.rawBody.toString() : JSON.stringify(body),
      signature: headers['stripe-signature'],
    };

    const result = await this.webhookService.processWebhookEvent(event);
    return { success: true, processed: result.processed };
  }

  @Post('paypal')
  @ApiOperation({ summary: 'Handle PayPal webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handlePayPalWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, string>,
  ) {
    const event: WebhookEvent = {
      gateway: 'paypal',
      eventType: body.event_type,
      eventData: body,
      rawPayload: JSON.stringify(body),
      signature: headers['paypal-transmission-signature'],
    };

    const result = await this.webhookService.processWebhookEvent(event);
    return { success: true, processed: result.processed };
  }
}