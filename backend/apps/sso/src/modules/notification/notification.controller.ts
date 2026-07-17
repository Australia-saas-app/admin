import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationType } from '../../entities/notification.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('sso/notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: Object.values(NotificationType) },
        subject: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async createNotification(
    @Request() req: any,
    @Body() body: { type: NotificationType; subject: string; message: string },
  ) {
    const userId = req.user.userId;
    return await this.notificationService.createNotification(userId, body.type, body.subject, body.message);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send a notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  async sendNotification(@Param('id') id: string) {
    return await this.notificationService.sendNotification(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getNotifications(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const userId = req.user.userId;
    return await this.notificationService.getUserNotifications(userId, page, limit);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    return await this.notificationService.markAsRead(id, userId);
  }
}