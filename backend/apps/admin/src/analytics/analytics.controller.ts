import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Dashboard analytics retrieved successfully' })
  getDashboard(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDashboardAnalytics(query);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user analytics' })
  @ApiResponse({ status: 200, description: 'User analytics retrieved successfully' })
  getUserAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getUserAnalytics(query);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get order analytics' })
  @ApiResponse({ status: 200, description: 'Order analytics retrieved successfully' })
  getOrderAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getOrderAnalytics(query);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get payment analytics' })
  @ApiResponse({ status: 200, description: 'Payment analytics retrieved successfully' })
  getPaymentAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getPaymentAnalytics(query);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiResponse({ status: 200, description: 'Revenue analytics retrieved successfully' })
  getRevenueAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getPaymentAnalytics(query);
  }

  @Get('traffic/device')
  @ApiOperation({ summary: 'Get traffic by device' })
  @ApiResponse({ status: 200, description: 'Traffic by device retrieved successfully' })
  getTrafficByDevice(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getTrafficByDevice(query);
  }

  @Get('traffic/location')
  @ApiOperation({ summary: 'Get traffic by location' })
  @ApiResponse({ status: 200, description: 'Traffic by location retrieved successfully' })
  getTrafficByLocation(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getTrafficByLocation(query);
  }

  @Get('visitors')
  @ApiOperation({ summary: 'Get visitor statistics' })
  @ApiResponse({ status: 200, description: 'Visitor statistics retrieved successfully' })
  getVisitorStatistics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getVisitorStatistics(query);
  }
}



