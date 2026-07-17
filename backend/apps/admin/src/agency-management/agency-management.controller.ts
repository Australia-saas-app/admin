import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AgencyManagementService } from './agency-management.service';
import { AgencyQueryDto } from './dto/agency-query.dto';
import { UpdateAgencyStatusDto } from './dto/update-agency-status.dto';
import { AddPenaltyDto } from './dto/add-penalty.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { ChangeAccountOwnerDto } from './dto/change-account-owner.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { AdminRequest } from '../common/interfaces/request.interface';

@ApiTags('agencies')
@Controller('agencies')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AgencyManagementController {
  constructor(
    private readonly agencyManagementService: AgencyManagementService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of agencies with filters' })
  @ApiResponse({ status: 200, description: 'Agencies retrieved successfully' })
  getAgencies(@Query() query: AgencyQueryDto) {
    return this.agencyManagementService.getAgencies(query);
  }

  @Get(':agencyId')
  @ApiOperation({ summary: 'Get agency details by ID' })
  @ApiParam({ name: 'agencyId', description: 'Agency ID' })
  @ApiResponse({ status: 200, description: 'Agency details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Agency not found' })
  getAgencyDetails(@Param('agencyId') agencyId: string) {
    return this.agencyManagementService.getAgencyDetails(agencyId);
  }

  @Patch(':agencyId/status')
  @ApiOperation({ summary: 'Update agency status' })
  @ApiParam({ name: 'agencyId', description: 'Agency ID' })
  @ApiResponse({ status: 200, description: 'Agency status updated successfully' })
  @ApiResponse({ status: 404, description: 'Agency not found' })
  updateAgencyStatus(
    @Param('agencyId') agencyId: string,
    @Body() updateStatusDto: UpdateAgencyStatusDto,
    @Request() req: AdminRequest,
  ) {
    const adminEmail = req.admin?.email;
    return this.agencyManagementService.updateAgencyStatus(
      agencyId,
      updateStatusDto,
      adminEmail,
    );
  }

  @Post(':agencyId/penalty')
  @ApiOperation({ summary: 'Add penalty to agency' })
  @ApiParam({ name: 'agencyId', description: 'Agency ID' })
  @ApiResponse({ status: 201, description: 'Penalty added successfully' })
  addPenalty(
    @Param('agencyId') agencyId: string,
    @Body() penaltyDto: AddPenaltyDto,
    @Request() req: AdminRequest,
  ) {
    const adminEmail = req.admin?.email;
    return this.agencyManagementService.addPenalty(
      agencyId,
      penaltyDto,
      adminEmail,
    );
  }

  @Patch(':agencyId')
  @ApiOperation({ summary: 'Update agency information' })
  @ApiParam({ name: 'agencyId', description: 'Agency ID' })
  @ApiResponse({ status: 200, description: 'Agency updated successfully' })
  updateAgency(
    @Param('agencyId') agencyId: string,
    @Body() updateDto: UpdateAgencyDto,
  ) {
    return this.agencyManagementService.updateAgency(agencyId, updateDto);
  }

  @Patch(':agencyId/account-owner')
  @ApiOperation({ summary: 'Change agency account owner (email/phone)' })
  @ApiParam({ name: 'agencyId', description: 'Agency ID' })
  @ApiResponse({ status: 200, description: 'Account owner updated successfully' })
  changeAccountOwner(
    @Param('agencyId') agencyId: string,
    @Body() changeOwnerDto: ChangeAccountOwnerDto,
  ) {
    return this.agencyManagementService.changeAccountOwner(
      agencyId,
      changeOwnerDto,
    );
  }

  @Get(':agencyId/activity')
  @ApiOperation({ summary: 'Get agency activity logs' })
  @ApiParam({ name: 'agencyId', description: 'Agency ID' })
  @ApiResponse({ status: 200, description: 'Agency activity retrieved successfully' })
  getAgencyActivity(@Param('agencyId') agencyId: string) {
    return this.agencyManagementService.getAgencyActivity(agencyId);
  }

  @Get(':agencyId/orders')
  @ApiOperation({ summary: 'Get agency orders' })
  @ApiParam({ name: 'agencyId', description: 'Agency ID' })
  @ApiResponse({ status: 200, description: 'Agency orders retrieved successfully' })
  getAgencyOrders(@Param('agencyId') agencyId: string, @Query() query: any) {
    return this.agencyManagementService.getAgencyOrders(agencyId, query);
  }

  @Get(':agencyId/transactions')
  @ApiOperation({ summary: 'Get agency transactions' })
  @ApiParam({ name: 'agencyId', description: 'Agency ID' })
  @ApiResponse({ status: 200, description: 'Agency transactions retrieved successfully' })
  getAgencyTransactions(@Param('agencyId') agencyId: string, @Query() query: any) {
    return this.agencyManagementService.getAgencyTransactions(agencyId, query);
  }
}

