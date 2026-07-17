import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send notification via specific channel' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  async sendNotification(@Body() sendDto: {
    channel: string;
    recipient: string;
    subject?: string;
    message: string;
    data?: any;
  }) {
    return this.deliveryService.sendNotification(sendDto);
  }

  @Post('bulk-send')
  @ApiOperation({ summary: 'Send bulk notifications' })
  @ApiResponse({ status: 200, description: 'Bulk notifications sent successfully' })
  async sendBulkNotifications(@Body() bulkDto: {
    notifications: {
      channel: string;
      recipient: string;
      subject?: string;
      message: string;
      data?: any;
    }[];
  }) {
    return this.deliveryService.sendBulkNotifications(bulkDto.notifications);
  }
}