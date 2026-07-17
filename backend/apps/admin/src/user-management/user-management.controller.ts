import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserManagementService } from './user-management.service';
import { UserQueryDto } from './dto/user-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { AdminRequest } from '../common/interfaces/request.interface';

@ApiTags('users')
@Controller('auth/admin')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get paginated list of users with filters' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  getUsers(@Query() query: UserQueryDto, @Request() req: AdminRequest) {
    const token = req.headers.authorization;
    return this.userManagementService.getUsers(query, token);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserDetails(@Param('userId') userId: string, @Request() req: AdminRequest) {
    const token = req.headers.authorization;
    return this.userManagementService.getUserDetails(userId, token);
  }

  @Patch('users/:userId/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUserStatus(
    @Param('userId') userId: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @Request() req: AdminRequest,
  ) {
    const token = req.headers.authorization;
    const adminEmail = req.admin?.email;
    return this.userManagementService.updateUserStatus(userId, updateStatusDto, adminEmail, token);
  }

  @Get('users/:userId/activity')
  @ApiOperation({ summary: 'Get user activity logs' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User activity retrieved successfully' })
  getUserActivity(@Param('userId') userId: string) {
    return this.userManagementService.getUserActivity(userId);
  }

  @Patch('users/:userId/account-owner')
  @ApiOperation({ summary: 'Change user account owner (email/phone)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Account owner updated successfully' })
  changeAccountOwner(
    @Param('userId') userId: string,
    @Body('emailOrPhone') emailOrPhone: string,
  ) {
    return this.userManagementService.changeAccountOwner(userId, emailOrPhone);
  }

  @Get('users/:userId/verified-info')
  @ApiOperation({ summary: 'Get user verified information' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Verified information retrieved successfully' })
  getVerifiedInfo(@Param('userId') userId: string) {
    return this.userManagementService.getVerifiedInfo(userId);
  }

  @Get('users/:userId/orders')
  @ApiOperation({ summary: 'Get user orders' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User orders retrieved successfully' })
  getUserOrders(@Param('userId') userId: string, @Query() query: any) {
    return this.userManagementService.getUserOrders(userId, query);
  }

  @Get('users/:userId/transactions')
  @ApiOperation({ summary: 'Get user transactions' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User transactions retrieved successfully' })
  getUserTransactions(@Param('userId') userId: string, @Query() query: any) {
    return this.userManagementService.getUserTransactions(userId, query);
  }
}


