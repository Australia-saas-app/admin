import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { WithdrawalRequestDto } from './dto/withdrawal-request.dto';

@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
export class WithdrawalsController {
  constructor(private readonly walletService: WalletService) {}

  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  async requestWithdrawal(@Request() req: any, @Body() dto: WithdrawalRequestDto) {
    if (!req.user?.userId) {
      throw new ForbiddenException('Invalid authentication payload');
    }
    return this.walletService.requestWithdrawal(req.user.userId, req.user.accountType, dto);
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  async getMyWithdrawals(@Request() req: any) {
    if (!req.user?.userId) {
      throw new ForbiddenException('Invalid authentication payload');
    }
    return this.walletService.getMyWithdrawals(req.user.userId, req.user.accountType);
  }
}

