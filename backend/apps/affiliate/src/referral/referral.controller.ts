import { Controller, Get, Post, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('referrals')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('referral-code')
  @ApiOperation({ summary: 'Get personal referral code' })
  async getReferralCode(@Req() req: any) {
    const userId = req.user.userId;
    return this.referralService.getReferralCode(userId);
  }

  @Get('referrals/stats')
  @ApiOperation({ summary: 'Get referral statistics' })
  async getReferralStats(@Req() req: any) {
    const userId = req.user.userId;
    return this.referralService.getReferralStats(userId);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'List referrals with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getReferrals(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const userId = req.user.userId;
    return this.referralService.getReferrals(userId, page, limit);
  }

  @Get('referrals/:id')
  @ApiOperation({ summary: 'Get detailed information about a specific referral' })
  async getReferralDetails(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.referralService.getReferralDetails(id, userId);
  }

  @Post('referrals')
  @ApiOperation({ summary: 'Create a new referral (for signup with code)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        referredUserId: { type: 'string' },
        referralCode: { type: 'string' },
      },
    },
  })
  async createReferral(
    @Body() body: { referredUserId: string; referralCode: string },
  ) {
    const affiliate = await this.referralService.findAffiliateByReferralCode(body.referralCode);
    return this.referralService.createReferral(affiliate.userId, body.referredUserId, body.referralCode);
  }

  @Post('admin/referrals/:id/complete')
  @ApiOperation({ summary: 'Mark referral as completed (admin)' })
  async completeReferral(@Param('id') id: string) {
    return this.referralService.completeReferral(id);
  }
}