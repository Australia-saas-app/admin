import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AdminManagementService } from './admin-management.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';

@ApiTags('admins')
@Controller('admins')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AdminManagementController {
  constructor(private readonly adminManagementService: AdminManagementService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of admins/sub-admins' })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully' })
  getAdmins(
    @Query('role') role?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminManagementService.getAdmins(role, page, limit);
  }

  @Post()
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Create a new admin/sub-admin (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminManagementService.createAdmin(createAdminDto);
  }

  @Patch(':adminId')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Update admin (Super Admin only)' })
  @ApiParam({ name: 'adminId', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  updateAdmin(
    @Param('adminId') adminId: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminManagementService.updateAdmin(adminId, updateAdminDto);
  }

  @Delete(':adminId')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Delete admin (Super Admin only)' })
  @ApiParam({ name: 'adminId', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  deleteAdmin(@Param('adminId') adminId: string) {
    return this.adminManagementService.deleteAdmin(adminId);
  }

  @Get(':adminId/activity')
  @ApiOperation({ summary: 'Get admin activity logs' })
  @ApiParam({ name: 'adminId', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin activity retrieved successfully' })
  getAdminActivity(@Param('adminId') adminId: string) {
    return this.adminManagementService.getAdminActivity(adminId);
  }
}


