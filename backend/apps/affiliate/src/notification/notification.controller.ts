import { Controller, Get, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get notification history for the authenticated affiliate user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getNotifications(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const userId = req.user.userId;
    return this.notificationService.getNotifications(userId, page, limit);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        emailNotifications: { type: 'boolean' },
        commissionAlerts: { type: 'boolean' },
        referralAlerts: { type: 'boolean' },
      },
    },
  })
  async updateNotificationPreferences(
    @Req() req: any,
    @Body() body: { emailNotifications?: boolean; commissionAlerts?: boolean; referralAlerts?: boolean },
  ) {
    const userId = req.user.userId;
    return this.notificationService.updateNotificationPreferences(userId, body);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  async markNotificationAsRead(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.notificationService.markNotificationAsRead(id, userId);
  }
}