import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CommissionService } from './commission.service';

@ApiTags('commissions')
@Controller('commissions')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get()
  @ApiOperation({ summary: 'List commission history with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCommissions(
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.commissionService.getCommissions(userId, page, limit);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending commissions awaiting payout' })
  async getPendingCommissions(@Query('userId') userId: string) {
    return this.commissionService.getPendingCommissions(userId);
  }

  @Get('paid')
  @ApiOperation({ summary: 'Get paid commissions history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPaidCommissions(
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.commissionService.getPaidCommissions(userId, page, limit);
  }

  @Post('calculate/:referralId')
  @ApiOperation({ summary: 'Calculate commission for a completed referral' })
  @ApiParam({ name: 'referralId', description: 'Referral ID' })
  async calculateCommission(@Param('referralId') referralId: string) {
    return this.commissionService.calculateCommission(referralId);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Mark commission as paid' })
  @ApiParam({ name: 'id', description: 'Commission ID' })
  async payCommission(@Param('id') id: string) {
    return this.commissionService.payCommission(id);
  }
}