import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('reports')
@Controller('reports')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('financial')
  @ApiOperation({ summary: 'Generate financial report' })
  @ApiResponse({ status: 200, description: 'Financial report generated successfully' })
  getFinancialReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.reportsService.generateFinancialReport(startDate, endDate);
  }

  @Get('users')
  @ApiOperation({ summary: 'Generate user report' })
  @ApiResponse({ status: 200, description: 'User report generated successfully' })
  getUserReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.reportsService.generateUserReport(startDate, endDate);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Generate order report' })
  @ApiResponse({ status: 200, description: 'Order report generated successfully' })
  getOrderReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.reportsService.generateOrderReport(startDate, endDate);
  }
}




