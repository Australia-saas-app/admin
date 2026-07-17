import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { AdminRequest } from '../common/interfaces/request.interface';

@ApiTags('wallets')
@Controller('wallets')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId/balance')
  @ApiOperation({ summary: 'Get wallet balance for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getBalance(@Param('userId') userId: string) {
    const balance = await this.walletService.getBalance(userId);
    return { balance };
  }

  @Post(':userId/deposit')
  @ApiOperation({ summary: 'Deposit amount to user wallet' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Deposit successful' })
  async deposit(
    @Param('userId') userId: string,
    @Body() body: { amount: number },
  ) {
    const wallet = await this.walletService.deposit(userId, body.amount);
    return wallet;
  }

  @Post(':userId/withdraw')
  @ApiOperation({ summary: 'Withdraw amount from user wallet' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Insufficient balance' })
  async withdraw(
    @Param('userId') userId: string,
    @Body() body: { amount: number },
  ) {
    const wallet = await this.walletService.withdraw(userId, body.amount);
    return wallet;
  }

  @Post(':userId/create')
  @ApiOperation({ summary: 'Create wallet for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  async createWallet(@Param('userId') userId: string) {
    const wallet = await this.walletService.createWallet(userId);
    return wallet;
  }

  @Get(':userId/commission-rate')
  @ApiOperation({ summary: 'Get commission rate for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Commission rate retrieved successfully' })
  async getCommissionRate(@Param('userId') userId: string) {
    const rate = await this.walletService.getCommissionRate(userId);
    return { commissionRate: rate };
  }

  @Post(':userId/commission-rate')
  @ApiOperation({ summary: 'Set commission rate for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Commission rate set successfully' })
  async setCommissionRate(
    @Param('userId') userId: string,
    @Body() body: { rate: number },
  ) {
    const wallet = await this.walletService.setCommissionRate(userId, body.rate);
    return wallet;
  }

  @Post(':userId/calculate-commission')
  @ApiOperation({ summary: 'Calculate commission for amount' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Commission calculated successfully' })
  async calculateCommission(
    @Param('userId') userId: string,
    @Body() body: { amount: number },
  ) {
    const commission = await this.walletService.calculateCommission(userId, body.amount);
    return { commission };
  }
}