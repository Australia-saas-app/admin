import { Controller, Get, Post, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
import { BusinessService } from './business.service';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { UserStatus, AccountType } from '../../entities/user.entity';

@Controller('business')
@UseGuards(AccessTokenGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    const userId = req.auth?.user?.userId;
    return await this.businessService.getBusinessProfile(userId);
  }

  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() updates: any) {
    const userId = req.auth?.user?.userId;
    return await this.businessService.updateBusinessProfile(userId, updates);
  }

  @Post('verify')
  async verifyBusiness(@Request() req: any) {
    const userId = req.auth?.user?.userId;
    return await this.businessService.verifyBusiness(userId);
  }

  @Post('approve')
  async approveBusiness(@Request() req: any) {
    const userId = req.auth?.user?.userId;
    return await this.businessService.approveBusiness(userId);
  }

  @Patch('status')
  async updateStatus(@Request() req: any, @Body() body: { status: UserStatus }) {
    const userId = req.auth?.user?.userId;
    return await this.businessService.updateBusinessStatus(userId, body.status);
  }

  @Get('roles')
  async getRoles(@Request() req: any) {
    const userId = req.auth?.user?.userId;
    return await this.businessService.getBusinessRoles(userId);
  }

  @Post('roles')
  async assignRole(@Request() req: any, @Body() body: { role: string }) {
    const userId = req.auth?.user?.userId;
    return await this.businessService.assignBusinessRole(userId, body.role);
  }

  @Get(':userId')
  async getBusinessById(@Param('userId') userId: string) {
    return await this.businessService.getBusinessProfile(userId);
  }
}