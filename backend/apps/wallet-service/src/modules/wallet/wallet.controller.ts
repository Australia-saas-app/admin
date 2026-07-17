import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('wallet')
@Controller('wallet')
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

  @Post('refund')
  @ApiOperation({ summary: 'Refund to wallet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        description: { type: 'string' },
      },
    },
  })
  async refund(@Request() req: any, @Body() body: { amount: number; description?: string }) {
    const userId = req.user.userId;
    return await this.walletService.refund(userId, body.amount, body.description);
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Adjust wallet balance' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        adjustment: { type: 'number' },
        description: { type: 'string' },
      },
    },
  })
  async adjustBalance(@Request() req: any, @Body() body: { adjustment: number; description?: string }) {
    const userId = req.user.userId;
    return await this.walletService.adjustBalance(userId, body.adjustment, body.description);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get wallet analytics' })
  async getAnalytics(@Request() req: any) {
    const userId = req.user.userId;
    return await this.walletService.getWalletAnalytics(userId);
  }

  @Post('check-fraud')
  @ApiOperation({ summary: 'Check for fraud' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
      },
    },
  })
  async checkFraud(@Request() req: any, @Body() body: { amount: number }) {
    const userId = req.user.userId;
    const isFraud = await this.walletService.checkFraud(userId, body.amount);
    return { isFraud };
  }

  @Post('integrate')
  @ApiOperation({ summary: 'Integrate with other services' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        service: { type: 'string' },
        data: { type: 'object' },
      },
    },
  })
  async integrate(@Request() req: any, @Body() body: { service: string; data: any }) {
    const userId = req.user.userId;
    return await this.walletService.integrateWithService(userId, body.service, body.data);
  }
}