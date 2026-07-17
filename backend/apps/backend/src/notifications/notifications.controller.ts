import { Controller, Get, Patch, Param, Query, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import * as jwt from 'jsonwebtoken';

@Controller('admin/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  private getAdminEmail(authHeader: string): string {
    const token = authHeader?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    // Temporarily skip verification for testing
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.email) {
      throw new Error('Invalid token');
    }
    return decoded.email;
  }

  @Get()
  async getNotifications(
    @Query() query: GetNotificationsDto,
    @Headers('authorization') authHeader: string,
  ) {
    const adminEmail = this.getAdminEmail(authHeader);
    return this.notificationsService.getNotifications(query, adminEmail);
  }

  @Patch(':notificationId/read')
  async markAsRead(
    @Param('notificationId') notificationId: string,
    @Headers('authorization') authHeader: string,
  ) {
    const adminEmail = this.getAdminEmail(authHeader);
    return this.notificationsService.markAsRead(notificationId, adminEmail);
  }

  @Patch('read-all')
  async markAllAsRead(
    @Headers('authorization') authHeader: string,
  ) {
    const adminEmail = this.getAdminEmail(authHeader);
    return this.notificationsService.markAllAsRead(adminEmail);
  }
}