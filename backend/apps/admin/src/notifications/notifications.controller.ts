import { Controller, Get, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { AdminRequest } from '../common/interfaces/request.interface';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  getNotifications(@Query() query: any, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.notificationsService.getNotifications(query, token);
  }

  @Patch(':notificationId/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  markAsRead(@Param('notificationId') notificationId: string, @Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.notificationsService.markAsRead(notificationId, token);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  markAllAsRead(@Request() req: AdminRequest) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.notificationsService.markAllAsRead(token);
  }
}




