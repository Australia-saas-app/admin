import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('wallet')
@Controller('sso/wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get wallet details' })
  async getWallet(@Request() req: any) {
    const userId = req.user.userId;
    return await this.walletService.getWallet(userId);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getBalance(@Request() req: any) {
    const userId = req.user.userId;
    const balance = await this.walletService.getBalance(userId);
    return { balance };
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit to wallet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        description: { type: 'string' },
      },
    },
  })
  async deposit(@Request() req: any, @Body() body: { amount: number; description?: string }) {
    const userId = req.user.userId;
    return await this.walletService.deposit(userId, body.amount, body.description);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw from wallet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        description: { type: 'string' },
      },
    },
  })
  async withdraw(@Request() req: any, @Body() body: { amount: number; description?: string }) {
    const userId = req.user.userId;
    return await this.walletService.withdraw(userId, body.amount, body.description);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTransactions(@Request() req: any, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const userId = req.user.userId;
    return await this.walletService.getTransactions(userId, page, limit);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create wallet for user' })
  async createWallet(@Request() req: any) {
    const userId = req.user.userId;
    return await this.walletService.createWallet(userId);
  }
}