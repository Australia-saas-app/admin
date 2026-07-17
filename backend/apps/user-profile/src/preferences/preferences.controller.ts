import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PreferencesService } from './preferences.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/request.interface';

@ApiTags('preferences')
@Controller('preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences retrieved successfully',
  })
  getPreferences(@Request() req: UserRequest) {
    return this.preferencesService.getPreferences(req.user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  updatePreferences(
    @Request() req: UserRequest,
    @Body() updateDto: UpdatePreferenceDto,
  ) {
    return this.preferencesService.updatePreferences(
      req.user.userId,
      updateDto,
    );
  }
}
