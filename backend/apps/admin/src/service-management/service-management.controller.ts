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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ServiceManagementService } from './service-management.service';
import { ServiceQueryDto, ServiceType } from './dto/service-query.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ReorderServiceDto } from './dto/reorder-service.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('services')
@Controller('services')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ServiceManagementController {
  constructor(
    private readonly serviceManagementService: ServiceManagementService,
  ) {}

  // Technical Services
  @Get('technical')
  @ApiOperation({ summary: 'Get all technical services' })
  @ApiResponse({ status: 200, description: 'Technical services retrieved successfully' })
  getTechnicalServices(@Query() query: ServiceQueryDto) {
    return this.serviceManagementService.getServices(ServiceType.TECHNICAL, query);
  }

  @Get('technical/:serviceId')
  @ApiOperation({ summary: 'Get technical service details' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  getTechnicalServiceDetails(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.getServiceDetails(
      ServiceType.TECHNICAL,
      serviceId,
    );
  }

  @Post('technical')
  @ApiOperation({ summary: 'Create technical service' })
  @ApiResponse({ status: 201, description: 'Technical service created successfully' })
  createTechnicalService(@Body() createDto: CreateServiceDto) {
    return this.serviceManagementService.createService(
      ServiceType.TECHNICAL,
      createDto,
    );
  }

  @Patch('technical/:serviceId')
  @ApiOperation({ summary: 'Update technical service' })
  @ApiResponse({ status: 200, description: 'Technical service updated successfully' })
  updateTechnicalService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
  ) {
    return this.serviceManagementService.updateService(
      ServiceType.TECHNICAL,
      serviceId,
      updateDto,
    );
  }

  @Delete('technical/:serviceId')
  @ApiOperation({ summary: 'Delete technical service' })
  @ApiResponse({ status: 200, description: 'Technical service deleted successfully' })
  deleteTechnicalService(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.deleteService(
      ServiceType.TECHNICAL,
      serviceId,
    );
  }

  @Patch('technical/:serviceId/visibility')
  @ApiOperation({ summary: 'Toggle technical service visibility' })
  @ApiResponse({ status: 200, description: 'Visibility toggled successfully' })
  toggleTechnicalVisibility(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.toggleVisibility(
      ServiceType.TECHNICAL,
      serviceId,
    );
  }

  @Post('technical/reorder')
  @ApiOperation({ summary: 'Reorder technical services' })
  @ApiResponse({ status: 200, description: 'Services reordered successfully' })
  reorderTechnicalServices(@Body() reorderDto: ReorderServiceDto[]) {
    return this.serviceManagementService.reorderServices(
      ServiceType.TECHNICAL,
      reorderDto,
    );
  }

  // Construction Services
  @Get('construction')
  @ApiOperation({ summary: 'Get all construction services' })
  getConstructionServices(@Query() query: ServiceQueryDto) {
    return this.serviceManagementService.getServices(
      ServiceType.CONSTRUCTION,
      query,
    );
  }

  @Get('construction/:serviceId')
  getConstructionServiceDetails(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.getServiceDetails(
      ServiceType.CONSTRUCTION,
      serviceId,
    );
  }

  @Post('construction')
  createConstructionService(@Body() createDto: CreateServiceDto) {
    return this.serviceManagementService.createService(
      ServiceType.CONSTRUCTION,
      createDto,
    );
  }

  @Patch('construction/:serviceId')
  updateConstructionService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
  ) {
    return this.serviceManagementService.updateService(
      ServiceType.CONSTRUCTION,
      serviceId,
      updateDto,
    );
  }

  @Delete('construction/:serviceId')
  deleteConstructionService(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.deleteService(
      ServiceType.CONSTRUCTION,
      serviceId,
    );
  }

  @Patch('construction/:serviceId/visibility')
  toggleConstructionVisibility(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.toggleVisibility(
      ServiceType.CONSTRUCTION,
      serviceId,
    );
  }

  @Post('construction/reorder')
  reorderConstructionServices(@Body() reorderDto: ReorderServiceDto[]) {
    return this.serviceManagementService.reorderServices(
      ServiceType.CONSTRUCTION,
      reorderDto,
    );
  }

  // Real Estate Services
  @Get('real-estate')
  @ApiOperation({ summary: 'Get all real estate services' })
  getRealEstateServices(@Query() query: ServiceQueryDto) {
    return this.serviceManagementService.getServices(
      ServiceType.REAL_ESTATE,
      query,
    );
  }

  @Get('real-estate/:serviceId')
  getRealEstateServiceDetails(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.getServiceDetails(
      ServiceType.REAL_ESTATE,
      serviceId,
    );
  }

  @Post('real-estate')
  createRealEstateService(@Body() createDto: CreateServiceDto) {
    return this.serviceManagementService.createService(
      ServiceType.REAL_ESTATE,
      createDto,
    );
  }

  @Patch('real-estate/:serviceId')
  updateRealEstateService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
  ) {
    return this.serviceManagementService.updateService(
      ServiceType.REAL_ESTATE,
      serviceId,
      updateDto,
    );
  }

  @Delete('real-estate/:serviceId')
  deleteRealEstateService(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.deleteService(
      ServiceType.REAL_ESTATE,
      serviceId,
    );
  }

  @Patch('real-estate/:serviceId/visibility')
  toggleRealEstateVisibility(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.toggleVisibility(
      ServiceType.REAL_ESTATE,
      serviceId,
    );
  }

  @Post('real-estate/reorder')
  reorderRealEstateServices(@Body() reorderDto: ReorderServiceDto[]) {
    return this.serviceManagementService.reorderServices(
      ServiceType.REAL_ESTATE,
      reorderDto,
    );
  }

  // Import Export Services
  @Get('import-export')
  @ApiOperation({ summary: 'Get all import export services' })
  getImportExportServices(@Query() query: ServiceQueryDto) {
    return this.serviceManagementService.getServices(
      ServiceType.IMPORT_EXPORT,
      query,
    );
  }

  @Get('import-export/:serviceId')
  getImportExportServiceDetails(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.getServiceDetails(
      ServiceType.IMPORT_EXPORT,
      serviceId,
    );
  }

  @Post('import-export')
  createImportExportService(@Body() createDto: CreateServiceDto) {
    return this.serviceManagementService.createService(
      ServiceType.IMPORT_EXPORT,
      createDto,
    );
  }

  @Patch('import-export/:serviceId')
  updateImportExportService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
  ) {
    return this.serviceManagementService.updateService(
      ServiceType.IMPORT_EXPORT,
      serviceId,
      updateDto,
    );
  }

  @Delete('import-export/:serviceId')
  deleteImportExportService(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.deleteService(
      ServiceType.IMPORT_EXPORT,
      serviceId,
    );
  }

  @Patch('import-export/:serviceId/visibility')
  toggleImportExportVisibility(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.toggleVisibility(
      ServiceType.IMPORT_EXPORT,
      serviceId,
    );
  }

  @Post('import-export/reorder')
  reorderImportExportServices(@Body() reorderDto: ReorderServiceDto[]) {
    return this.serviceManagementService.reorderServices(
      ServiceType.IMPORT_EXPORT,
      reorderDto,
    );
  }

  // Visa Traveling Services
  @Get('visa-traveling')
  @ApiOperation({ summary: 'Get all visa traveling services' })
  getVisaTravelingServices(@Query() query: ServiceQueryDto) {
    return this.serviceManagementService.getServices(
      ServiceType.VISA_TRAVELING,
      query,
    );
  }

  @Get('visa-traveling/:serviceId')
  getVisaTravelingServiceDetails(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.getServiceDetails(
      ServiceType.VISA_TRAVELING,
      serviceId,
    );
  }

  @Post('visa-traveling')
  createVisaTravelingService(@Body() createDto: CreateServiceDto) {
    return this.serviceManagementService.createService(
      ServiceType.VISA_TRAVELING,
      createDto,
    );
  }

  @Patch('visa-traveling/:serviceId')
  updateVisaTravelingService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
  ) {
    return this.serviceManagementService.updateService(
      ServiceType.VISA_TRAVELING,
      serviceId,
      updateDto,
    );
  }

  @Delete('visa-traveling/:serviceId')
  deleteVisaTravelingService(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.deleteService(
      ServiceType.VISA_TRAVELING,
      serviceId,
    );
  }

  @Patch('visa-traveling/:serviceId/visibility')
  toggleVisaTravelingVisibility(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.toggleVisibility(
      ServiceType.VISA_TRAVELING,
      serviceId,
    );
  }

  @Post('visa-traveling/reorder')
  reorderVisaTravelingServices(@Body() reorderDto: ReorderServiceDto[]) {
    return this.serviceManagementService.reorderServices(
      ServiceType.VISA_TRAVELING,
      reorderDto,
    );
  }

  // Solutions Services
  @Get('solutions')
  @ApiOperation({ summary: 'Get all solutions services' })
  getSolutionsServices(@Query() query: ServiceQueryDto) {
    return this.serviceManagementService.getServices(
      ServiceType.SOLUTIONS,
      query,
    );
  }

  @Get('solutions/:serviceId')
  getSolutionsServiceDetails(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.getServiceDetails(
      ServiceType.SOLUTIONS,
      serviceId,
    );
  }

  @Post('solutions')
  createSolutionsService(@Body() createDto: CreateServiceDto) {
    return this.serviceManagementService.createService(
      ServiceType.SOLUTIONS,
      createDto,
    );
  }

  @Patch('solutions/:serviceId')
  updateSolutionsService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
  ) {
    return this.serviceManagementService.updateService(
      ServiceType.SOLUTIONS,
      serviceId,
      updateDto,
    );
  }

  @Delete('solutions/:serviceId')
  deleteSolutionsService(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.deleteService(
      ServiceType.SOLUTIONS,
      serviceId,
    );
  }

  @Patch('solutions/:serviceId/visibility')
  toggleSolutionsVisibility(@Param('serviceId') serviceId: string) {
    return this.serviceManagementService.toggleVisibility(
      ServiceType.SOLUTIONS,
      serviceId,
    );
  }

  @Post('solutions/reorder')
  reorderSolutionsServices(@Body() reorderDto: ReorderServiceDto[]) {
    return this.serviceManagementService.reorderServices(
      ServiceType.SOLUTIONS,
      reorderDto,
    );
  }
}

