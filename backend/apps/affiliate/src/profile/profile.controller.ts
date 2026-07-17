import { Controller, Get, Post, Patch, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AffiliateProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('affiliate-profile')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AffiliateProfileController {
  constructor(private readonly profileService: AffiliateProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get affiliate profile information' })
  async getAffiliateProfile(@Req() req: any) {
    const userId = req.user.userId;
    return this.profileService.getAffiliateProfile(userId);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up for the affiliate program' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        termsAccepted: { type: 'boolean' },
        referralCode: { type: 'string' },
      },
    },
  })
  async signUpForAffiliateProgram(
    @Req() req: any,
    @Body() body: { termsAccepted: boolean; referralCode?: string },
  ) {
    const userId = req.user.userId;
    return this.profileService.signUpForAffiliateProgram(userId, body.termsAccepted, body.referralCode);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update affiliate profile information' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        displayName: { type: 'string' },
        bio: { type: 'string' },
        socialLinks: { type: 'object' },
      },
    },
  })
  async updateAffiliateProfile(
    @Req() req: any,
    @Body() updates: { displayName?: string; bio?: string; socialLinks?: any },
  ) {
    const userId = req.user.userId;
    return this.profileService.updateAffiliateProfile(userId, updates);
  }
}