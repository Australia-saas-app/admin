import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';

@Controller('business/analytics')
@UseGuards(AccessTokenGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('performance')
  async getPerformance(@Request() req: any) {
    const userId = req.auth?.user?.userId;
    return await this.analyticsService.getBusinessPerformance(userId);
  }
}