import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get affiliate wallet balance and details' })
  async getWalletBalance(@Req() req: any) {
    const userId = req.user.userId;
    return this.walletService.getWalletBalance(userId);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer funds from affiliate wallet to main wallet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        currency: { type: 'string' },
      },
    },
  })
  async transferToMainWallet(
    @Req() req: any,
    @Body() body: { amount: number; currency: string },
  ) {
    const userId = req.user.userId;
    return this.walletService.transferToMainWallet(userId, body.amount, body.currency);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getWalletTransactions(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const userId = req.user.userId;
    return this.walletService.getWalletTransactions(userId, page, limit);
  }
}