import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLogsService } from './activity-logs.service';
import { LogQueryDto } from './dto/log-query.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('logs')
@Controller('logs')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get('activity')
  @ApiOperation({ summary: 'Get activity logs' })
  @ApiResponse({ status: 200, description: 'Activity logs retrieved successfully' })
  getActivityLogs(@Query() query: LogQueryDto) {
    return this.activityLogsService.getActivityLogs(query);
  }

  @Get('audit')
  @ApiOperation({ summary: 'Get audit trails' })
  @ApiResponse({ status: 200, description: 'Audit trails retrieved successfully' })
  getAuditTrails(@Query() query: LogQueryDto) {
    return this.activityLogsService.getAuditTrails(query);
  }

  @Get('system-events')
  @ApiOperation({ summary: 'Get system events' })
  @ApiResponse({ status: 200, description: 'System events retrieved successfully' })
  getSystemEvents(@Query() query: LogQueryDto) {
    return this.activityLogsService.getSystemEvents(query);
  }
}

