import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview analytics' })
  async getAnalyticsOverview(@Query('userId') userId: string) {
    return this.analyticsService.getAnalyticsOverview(userId);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'Get referral analytics data' })
  async getReferralAnalytics(@Query('userId') userId: string) {
    return this.analyticsService.getReferralAnalytics(userId);
  }

  @Get('commissions')
  @ApiOperation({ summary: 'Get commission analytics data' })
  async getCommissionAnalytics(@Query('userId') userId: string) {
    return this.analyticsService.getCommissionAnalytics(userId);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get performance trends over time' })
  @ApiQuery({ name: 'period', required: false, enum: ['month', 'week', 'day'] })
  async getPerformanceTrends(
    @Query('userId') userId: string,
    @Query('period') period: string = 'month',
  ) {
    return this.analyticsService.getPerformanceTrends(userId, period);
  }
}