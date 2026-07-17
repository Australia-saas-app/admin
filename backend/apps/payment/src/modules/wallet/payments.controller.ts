import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import {
  CapturePayPalProjectPaymentDto,
  CompleteStripeProjectPaymentDto,
  CreatePayPalProjectOrderDto,
  StripeProjectCheckoutDto,
} from './dto/project-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly walletService: WalletService) {}

  @Post('stripe/checkout')
  @HttpCode(HttpStatus.CREATED)
  async createStripeProjectCheckout(@Request() req: any, @Body() dto: StripeProjectCheckoutDto) {
    if (!req.user?.userId) {
      throw new ForbiddenException('Invalid authentication payload');
    }
    return this.walletService.createStripeProjectCheckout(req.user.userId, dto);
  }

  @Post('stripe/complete')
  @HttpCode(HttpStatus.OK)
  async completeStripeProjectPayment(
    @Request() req: any,
    @Body() dto: CompleteStripeProjectPaymentDto,
  ) {
    if (!req.user?.userId) {
      throw new ForbiddenException('Invalid authentication payload');
    }
    return this.walletService.completeStripeProjectPayment(req.user.userId, dto.paymentIntentId);
  }

  @Post('paypal/create-order')
  @HttpCode(HttpStatus.CREATED)
  async createPayPalProjectOrder(@Request() req: any, @Body() dto: CreatePayPalProjectOrderDto) {
    if (!req.user?.userId) {
      throw new ForbiddenException('Invalid authentication payload');
    }
    return this.walletService.createPayPalProjectOrder(req.user.userId, dto);
  }

  @Post('paypal/capture')
  @HttpCode(HttpStatus.OK)
  async capturePayPalProjectPayment(
    @Request() req: any,
    @Body() dto: CapturePayPalProjectPaymentDto,
  ) {
    if (!req.user?.userId) {
      throw new ForbiddenException('Invalid authentication payload');
    }
    return this.walletService.capturePayPalProjectPayment(req.user.userId, dto.paypalOrderId);
  }
}

