import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { ActivityQueryDto } from './dto/activity-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/request.interface';

@ApiTags('activity')
@Controller('activity')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get user activity logs' })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully',
  })
  getActivities(@Request() req: UserRequest, @Query() query: ActivityQueryDto) {
    return this.activityService.getActivities(req.user.userId, query);
  }
}
