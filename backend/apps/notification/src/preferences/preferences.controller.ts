import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PreferencesService } from './preferences.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@ApiTags('preferences')
@ApiBearerAuth('JWT-auth')
@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  @ApiOperation({ summary: 'Create user notification preferences' })
  @ApiResponse({ status: 201, description: 'Preferences created successfully' })
  async createPreferences(
    @Body() createPreferenceDto: CreatePreferenceDto,
    @Request() req: any,
  ) {
    return this.preferencesService.createPreferences(createPreferenceDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved successfully' })
  async getPreferences(@Request() req: any) {
    return this.preferencesService.getUserPreferences(req.user.userId);
  }

  @Get(':type')
  @ApiOperation({ summary: 'Get preferences for specific notification type' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved successfully' })
  async getPreferenceByType(
    @Param('type') type: string,
    @Request() req: any,
  ) {
    return this.preferencesService.getPreferencesByType(req.user.userId, type);
  }

  @Put(':type')
  @ApiOperation({ summary: 'Update preferences for specific notification type' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async updatePreferenceByType(
    @Param('type') type: string,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
    @Request() req: any,
  ) {
    return this.preferencesService.updatePreferencesByType(
      req.user.userId,
      type,
      updatePreferenceDto,
    );
  }

  @Put()
  @ApiOperation({ summary: 'Update all user preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async updatePreferences(
    @Body() updatePreferencesDto: { preferences: UpdatePreferenceDto[] },
    @Request() req: any,
  ) {
    return this.preferencesService.updateUserPreferences(
      req.user.userId,
      updatePreferencesDto.preferences,
    );
  }

  @Delete(':type')
  @ApiOperation({ summary: 'Delete preferences for specific notification type' })
  @ApiResponse({ status: 200, description: 'Preferences deleted successfully' })
  async deletePreferenceByType(
    @Param('type') type: string,
    @Request() req: any,
  ) {
    return this.preferencesService.deletePreferencesByType(req.user.userId, type);
  }

  @Post('bulk-update')
  @ApiOperation({ summary: 'Bulk update notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async bulkUpdatePreferences(
    @Body() bulkUpdateDto: { updates: { type: string; preferences: UpdatePreferenceDto }[] },
    @Request() req: any,
  ) {
    return this.preferencesService.bulkUpdatePreferences(req.user.userId, bulkUpdateDto.updates);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset preferences to defaults' })
  @ApiResponse({ status: 200, description: 'Preferences reset successfully' })
  async resetPreferences(@Request() req: any) {
    return this.preferencesService.resetUserPreferences(req.user.userId);
  }
}