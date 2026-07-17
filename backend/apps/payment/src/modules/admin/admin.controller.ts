import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { SetDepositAmountDto } from './dto/set-deposit.dto';
import { ProcessDepositRefundDto } from './dto/process-refund.dto';
import { SetCommissionRatesDto } from './dto/set-commission-rates.dto';
import { ProcessAffiliatePayoutDto } from './dto/process-payout.dto';
import { AnalyticsService } from '../wallet/services/analytics.service';
import { WalletService } from '../wallet/wallet.service';
import { TransactionHistoryQueryDto } from '../wallet/dto/transaction-history.dto';
import { RejectWithdrawalDto } from '../wallet/dto/withdrawal-request.dto';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly analyticsService: AnalyticsService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * Set security deposit amount for agency
   * PUT /admin/security-deposit/{agencyId}
   */
  @Put('security-deposit/:agencyId')
  @HttpCode(HttpStatus.OK)
  async setDepositAmount(
    @Param('agencyId') agencyId: string,
    @Body() setDepositDto: SetDepositAmountDto,
  ) {
    return this.adminService.setDepositAmount(agencyId, setDepositDto);
  }

  /**
   * Process security deposit refund
   * POST /admin/security-deposit/refund/{agencyId}
   */
  @Post('security-deposit/refund/:agencyId')
  @HttpCode(HttpStatus.CREATED)
  async processDepositRefund(
    @Param('agencyId') agencyId: string,
    @Body() refundDto: ProcessDepositRefundDto,
  ) {
    return this.adminService.processDepositRefund(agencyId, refundDto);
  }

  /**
   * Set affiliate commission rates
   * PUT /admin/affiliate/commission-rates
   */
  @Put('affiliate/commission-rates')
  @HttpCode(HttpStatus.OK)
  async setCommissionRates(@Body() setRatesDto: SetCommissionRatesDto) {
    return this.adminService.setCommissionRates(setRatesDto);
  }

  /**
   * Process affiliate payout
   * POST /admin/affiliate/payout/{affiliateId}
   */
  @Post('affiliate/payout/:affiliateId')
  @HttpCode(HttpStatus.CREATED)
  async processAffiliatePayout(
    @Param('affiliateId') affiliateId: string,
    @Body() payoutDto: ProcessAffiliatePayoutDto,
  ) {
    return this.adminService.processAffiliatePayout(affiliateId, payoutDto);
  }

  /**
   * Get transaction analytics
   * GET /admin/analytics/transactions
   */
  @Get('analytics/transactions')
  async getTransactionAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('currency') currency?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.analyticsService.generateAnalyticsReport(start, end, {
      userId,
      currency,
    });
  }

  /**
   * Get wallet analytics
   * GET /admin/analytics/wallets
   */
  @Get('analytics/wallets')
  async getWalletAnalytics() {
    return this.analyticsService.generateWalletAnalytics();
  }

  /**
   * Get revenue analytics
   * GET /admin/analytics/revenue
   */
  @Get('analytics/revenue')
  async getRevenueAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.analyticsService.getRevenueAnalytics(start, end);
  }

  /**
   * Get fraud analytics
   * GET /admin/analytics/fraud
   */
  @Get('analytics/fraud')
  async getFraudAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.analyticsService.getFraudAnalytics(start, end);
  }

  /**
   * Get all transactions (admin)
   * GET /admin/transactions
   */
  @Get('transactions')
  async getAllTransactions(@Query() query: TransactionHistoryQueryDto) {
    return this.walletService.getAllTransactions(query);
  }

  /**
   * Get transaction by ID (admin)
   * GET /admin/transactions/:id
   */
  @Get('transactions/:id')
  async getTransactionById(@Param('id') transactionId: string) {
    return this.walletService.getTransactionById(transactionId);
  }

  @Get('withdrawals')
  async getAllWithdrawalRequests() {
    return this.walletService.getAllWithdrawalRequests();
  }

  @Post('withdrawals/:id/pay')
  async payWithdrawalRequest(@Param('id') id: string, @Body('note') note: string, @Request() req: any) {
    return this.walletService.payWithdrawalRequest(id, req.admin?.adminId || 'admin', note);
  }

  @Post('withdrawals/:id/reject')
  async rejectWithdrawalRequest(
    @Param('id') id: string,
    @Body() dto: RejectWithdrawalDto,
    @Request() req: any,
  ) {
    return this.walletService.rejectWithdrawalRequest(id, req.admin?.adminId || 'admin', dto.reason);
  }
}