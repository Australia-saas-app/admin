import { Controller, Get, Post, Body, Query, UseGuards, Req, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('affiliate')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('earnings')
  @ApiOperation({ summary: 'Get earnings summary for the authenticated affiliate user' })
  async getEarningsSummary(@Req() req: any) {
    const userId = req.user.userId;
    return this.affiliateService.getEarningsSummary(userId);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Request withdrawal of earnings to main wallet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        currency: { type: 'string' },
        method: { type: 'string' },
      },
    },
  })
  async requestWithdrawal(
    @Req() req: any,
    @Body() body: { amount: number; currency: string; method: string },
  ) {
    const userId = req.user.userId;
    return this.affiliateService.requestWithdrawal(userId, body.amount, body.currency, body.method);
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'Get withdrawal history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getWithdrawalHistory(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const userId = req.user.userId;
    return this.affiliateService.getWithdrawalHistory(userId, page, limit);
  }

  @Get('admin/affiliates')
  @ApiOperation({ summary: 'Get all affiliates (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllAffiliates(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.affiliateService.getAllAffiliates(page, limit);
  }

  @Post('admin/affiliates')
  @ApiOperation({ summary: 'Create affiliate (admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
      },
    },
  })
  async createAffiliate(@Body() body: { userId: string }) {
    return this.affiliateService.createAffiliate(body.userId);
  }

  @Get('admin/withdrawals/pending')
  @ApiOperation({ summary: 'Get pending withdrawals (admin)' })
  async getPendingWithdrawals() {
    return this.affiliateService.getPendingWithdrawals();
  }

  @Post('admin/withdrawals/:id/approve')
  @ApiOperation({ summary: 'Approve withdrawal (admin)' })
  @ApiParam({ name: 'id', description: 'Withdrawal ID' })
  async approveWithdrawal(@Param('id') id: string) {
    return this.affiliateService.approveWithdrawal(id);
  }

  @Post('admin/withdrawals/:id/reject')
  @ApiOperation({ summary: 'Reject withdrawal (admin)' })
  @ApiParam({ name: 'id', description: 'Withdrawal ID' })
  async rejectWithdrawal(@Param('id') id: string) {
    return this.affiliateService.rejectWithdrawal(id);
  }
}