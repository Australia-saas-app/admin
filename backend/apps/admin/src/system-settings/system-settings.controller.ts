import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SystemSettingsService } from './system-settings.service';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';

@ApiTags('settings')
@Controller('settings')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get system settings' })
  @ApiResponse({ status: 200, description: 'System settings retrieved successfully' })
  getSettings() {
    return this.systemSettingsService.getSettings();
  }

  @Patch()
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Update system settings (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'System settings updated successfully' })
  updateSettings(@Body() settings: any) {
    return this.systemSettingsService.updateSettings(settings);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System health retrieved successfully' })
  getSystemHealth() {
    return this.systemSettingsService.getSystemHealth();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get system statistics' })
  @ApiResponse({ status: 200, description: 'System statistics retrieved successfully' })
  getStatistics() {
    return this.systemSettingsService.getStatistics();
  }

  @Patch('password')
  @ApiOperation({ summary: 'Change admin password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Request() req: any,
  ) {
    const adminId = req.admin?.id || req.admin?.adminId;
    return this.systemSettingsService.changePassword(adminId, oldPassword, newPassword);
  }
}



