import { Controller, Get, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PresenceService } from './presence.service';
import { SimpleAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('presence')
@Controller('presence')
@UseGuards(SimpleAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Get('online')
  @ApiOperation({ summary: 'Get online users' })
  async getOnlineUsers() {
    return this.presenceService.getOnlineUsers();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get presence statistics' })
  async getPresenceStats() {
    return this.presenceService.getOnlineUsers(); // Reuse the same logic
  }

  @Post('online')
  @ApiOperation({ summary: 'Set current user as online' })
  async setOnline(@CurrentUser() user: any) {
    await this.presenceService.setUserOnline(user.userId);
    return { success: true, message: 'User set as online' };
  }

  @Delete('online')
  @ApiOperation({ summary: 'Set current user as offline' })
  async setOffline(@CurrentUser() user: any) {
    await this.presenceService.setUserOffline(user.userId);
    return { success: true, message: 'User set as offline' };
  }

  @Put('status')
  @ApiOperation({ summary: 'Update user presence status' })
  async updateStatus(@CurrentUser() user: any, @Body() body: { status: string }) {
    const { status } = body;
    if (status === 'online') {
      await this.presenceService.setUserOnline(user.userId);
    } else if (status === 'offline') {
      await this.presenceService.setUserOffline(user.userId);
    } else {
      // For other statuses like 'away', 'busy', etc., could store separately
      // For now, treat as offline
      await this.presenceService.setUserOffline(user.userId);
    }
    return { success: true, message: `User status set to ${status}` };
  }
}