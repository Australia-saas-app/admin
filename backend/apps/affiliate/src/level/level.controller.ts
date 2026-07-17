import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AffiliateLevelService } from './level.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('affiliate-level')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AffiliateLevelController {
  constructor(private readonly levelService: AffiliateLevelService) {}

  @Get('level')
  @ApiOperation({ summary: 'Get current affiliate level/rank information' })
  async getCurrentLevel(@Req() req: any) {
    const userId = req.user.userId;
    return this.levelService.getCurrentLevel(userId);
  }

  @Get('level/requirements')
  @ApiOperation({ summary: 'Get requirements for next level progression' })
  async getLevelRequirements(@Req() req: any) {
    const userId = req.user.userId;
    return this.levelService.getLevelRequirements(userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get top affiliates leaderboard' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLeaderboard(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.levelService.getLeaderboard(page, limit);
  }
}