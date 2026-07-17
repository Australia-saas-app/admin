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
import { AffiliateIncomeService } from './services/affiliate-income.service';
import { AffiliateAuthGuard } from '../../common/guards/affiliate-auth.guard';
import { AffiliateWithdrawalDto } from './dto/withdrawal.dto';
import { AffiliateIncomeHistoryQueryDto } from './dto/history-query.dto';
import { AffiliateReferralsQueryDto } from './dto/referrals-query.dto';

@Controller('affiliate/income')
@UseGuards(AffiliateAuthGuard)
export class AffiliateIncomeController {
  constructor(private readonly affiliateIncomeService: AffiliateIncomeService) {}

  /**
   * Get affiliate income balance
   * GET /affiliate/income/balance
   */
  @Get('balance')
  @HttpCode(HttpStatus.OK)
  async getIncomeBalance(@Request() req: any) {
    return this.affiliateIncomeService.getIncomeBalance(req.user.userId);
  }

  /**
   * Get affiliate income history
   * GET /affiliate/income/history
   */
  @Get('history')
  @HttpCode(HttpStatus.OK)
  async getIncomeHistory(@Request() req: any, @Query() query: AffiliateIncomeHistoryQueryDto) {
    return this.affiliateIncomeService.getIncomeHistory(req.user.userId, query);
  }

  /**
   * Request affiliate income withdrawal
   * POST /affiliate/income/withdraw
   */
  @Post('withdraw')
  @HttpCode(HttpStatus.CREATED)
  async requestWithdrawal(@Request() req: any, @Body() withdrawalDto: AffiliateWithdrawalDto) {
    return this.affiliateIncomeService.requestWithdrawal(req.user.userId, withdrawalDto);
  }

  /**
   * Get affiliate commission rates
   * GET /affiliate/commission-rates
   */
  @Get('commission-rates')
  @HttpCode(HttpStatus.OK)
  async getCommissionRates(@Request() req: any) {
    return this.affiliateIncomeService.getCommissionRates();
  }
}

@Controller('affiliate')
@UseGuards(AffiliateAuthGuard)
export class AffiliateReferralsController {
  constructor(private readonly affiliateIncomeService: AffiliateIncomeService) {}

  /**
   * Get affiliate referrals
   * GET /affiliate/referrals
   */
  @Get('referrals')
  @HttpCode(HttpStatus.OK)
  async getReferrals(@Request() req: any, @Query() query: AffiliateReferralsQueryDto) {
    return this.affiliateIncomeService.getReferrals(req.user.userId, query);
  }
}