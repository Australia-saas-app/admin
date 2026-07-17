import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SecurityDepositService } from './services/security-deposit.service';
import { BusinessAuthGuard } from '../../common/guards/business-auth.guard';
import { PaySecurityDepositDto } from './dto/pay-deposit.dto';
import { RequestSecurityDepositRefundDto } from './dto/refund-request.dto';
import { SecurityDepositHistoryQueryDto } from './dto/history-query.dto';

@Controller('security-deposit')
@UseGuards(BusinessAuthGuard)
export class SecurityDepositController {
  constructor(private readonly securityDepositService: SecurityDepositService) {}

  /**
   * Pay security deposit
   * POST /security-deposit/pay
   */
  @Post('pay')
  @HttpCode(HttpStatus.CREATED)
  async payDeposit(@Request() req: any, @Body() payDto: PaySecurityDepositDto) {
    return this.securityDepositService.payDeposit(req.user.userId, payDto);
  }

  /**
   * Get security deposit status
   * GET /security-deposit/status
   */
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getDepositStatus(@Request() req: any) {
    return this.securityDepositService.getDepositStatus(req.user.userId);
  }

  /**
   * Request security deposit refund
   * POST /security-deposit/refund
   */
  @Post('refund')
  @HttpCode(HttpStatus.CREATED)
  async requestRefund(@Request() req: any, @Body() refundDto: RequestSecurityDepositRefundDto) {
    return this.securityDepositService.requestRefund(req.user.userId, refundDto);
  }

  /**
   * Get security deposit history
   * GET /security-deposit/history
   */
  @Get('history')
  @HttpCode(HttpStatus.OK)
  async getDepositHistory(@Request() req: any, @Query() query: SecurityDepositHistoryQueryDto) {
    return this.securityDepositService.getDepositHistory(req.user.userId, query);
  }
}