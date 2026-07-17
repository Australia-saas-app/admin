import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommercialIndustrialServiceService } from './services/commercial-industrial-service.service';
import { CommercialIndustrialCategoryService } from './services/commercial-industrial-category.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ServiceQueryDto,
  CategoryQueryDto,
  ReorderDto,
} from './dto/query-params.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  RequestWithAdmin,
  RequestWithUser,
} from '../common/interfaces/request.interface';

@ApiTags('commercial-industrial-services')
@Controller('services')
export class CommercialIndustrialController {
  constructor(
    private readonly serviceService: CommercialIndustrialServiceService,
    private readonly categoryService: CommercialIndustrialCategoryService,
  ) {}

  // ==========================================
  // PUBLIC ROUTES - Services
  // ==========================================

  @Get()
  @ApiOperation({
    summary: 'Get all visible commercial & industrial services (Public)',
  })
  @ApiResponse({ status: 200, description: 'List of services' })
  async getServices(@Query() query: ServiceQueryDto) {
    return this.serviceService.findAll(query, false);
  }

  // ==========================================
  // AUTHENTICATED USER/AGENCY ROUTES - Services
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create commercial/industrial service (User/Agency/Business)',
  })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createService(
    @Body() createDto: CreateServiceDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createServiceForAccountTypes(createDto, req, [
      'user',
      'agency',
      'business',
    ]);
  }

  @Post('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create commercial/industrial service (User only)' })
  async createUserService(
    @Body() createDto: CreateServiceDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createServiceForAccountTypes(createDto, req, ['user']);
  }

  @Post('agent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create commercial/industrial service (Agent/Agency only)',
  })
  async createAgentService(
    @Body() createDto: CreateServiceDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createServiceForAccountTypes(createDto, req, ['agency']);
  }

  @Get('admin/list')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all commercial/industrial services (Admin)' })
  @ApiResponse({ status: 200, description: 'List of all services' })
  async getAdminServices(@Query() query: ServiceQueryDto, @Req() req: Request) {
    const rawIsVisible = req.query?.isVisible as string | undefined;
    if (
      rawIsVisible === '' ||
      rawIsVisible === null ||
      rawIsVisible === undefined
    ) {
      query.isVisible = undefined;
    }
    return this.serviceService.findAll(query, true);
  }

  @Get('admin/:serviceId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get single commercial/industrial service (Admin)',
  })
  async getAdminService(@Param('serviceId') serviceId: string) {
    return this.serviceService.findOne(serviceId, true);
  }

  // Public route for single service (must come after admin routes)
  @Get(':serviceId')
  @ApiOperation({
    summary: 'Get single commercial/industrial service (Public)',
  })
  @ApiResponse({ status: 200, description: 'Service details' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getService(@Param('serviceId') serviceId: string) {
    return this.serviceService.findOne(serviceId, false);
  }

  @Patch(':serviceId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update commercial/industrial service (Admin)' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async updateService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.serviceService.update(
      serviceId,
      updateDto,
      req.admin?.email || 'system',
    );
  }

  @Delete(':serviceId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete commercial/industrial service (Admin)' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async deleteService(@Param('serviceId') serviceId: string) {
    await this.serviceService.remove(serviceId);
    return { success: true, message: 'Service deleted successfully' };
  }

  @Patch('user/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update commercial/industrial service (User owns service)',
  })
  async updateUserService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
    @Req() req: RequestWithUser,
  ) {
    return this.updateServiceForAccountTypes(
      serviceId,
      updateDto,
      req,
      ['user'],
    );
  }

  @Patch('agent/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update commercial/industrial service (Agent/Agency owns service)',
  })
  async updateAgentService(
    @Param('serviceId') serviceId: string,
    @Body() updateDto: UpdateServiceDto,
    @Req() req: RequestWithUser,
  ) {
    return this.updateServiceForAccountTypes(
      serviceId,
      updateDto,
      req,
      ['agency'],
    );
  }

  @Delete('user/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete commercial/industrial service (User owns service)',
  })
  async deleteUserService(
    @Param('serviceId') serviceId: string,
    @Req() req: RequestWithUser,
  ) {
    await this.deleteServiceForAccountTypes(serviceId, req, ['user']);
    return { success: true, message: 'Service deleted successfully' };
  }

  @Delete('agent/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete commercial/industrial service (Agent/Agency owns service)',
  })
  async deleteAgentService(
    @Param('serviceId') serviceId: string,
    @Req() req: RequestWithUser,
  ) {
    await this.deleteServiceForAccountTypes(serviceId, req, ['agency']);
    return { success: true, message: 'Service deleted successfully' };
  }

  @Patch(':serviceId/visibility')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle service visibility (Admin)' })
  @ApiResponse({ status: 200, description: 'Visibility updated' })
  async toggleVisibility(
    @Param('serviceId') serviceId: string,
    @Body('isVisible') isVisible: boolean,
    @Req() req: RequestWithAdmin,
  ) {
    return this.serviceService.toggleVisibility(
      serviceId,
      isVisible,
      req.admin?.email || 'system',
    );
  }

  @Patch(':serviceId/reorder')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reorder service (Admin)' })
  @ApiResponse({ status: 200, description: 'Service reordered' })
  async reorderService(
    @Param('serviceId') serviceId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    return this.serviceService.reorder(serviceId, reorderDto.direction);
  }

  // ==========================================
  // PUBLIC ROUTES - Categories
  // ==========================================

  @Get('categories/list')
  @ApiOperation({
    summary: 'Get all active commercial/industrial categories (Public)',
  })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async getCategories(@Query() query: CategoryQueryDto) {
    const activeQuery = { ...query, isActive: true };
    return this.categoryService.findAll(activeQuery);
  }

  // ==========================================
  // ADMIN ROUTES - Categories
  // ==========================================

  @Post('categories')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create commercial/industrial category (Admin)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  async createCategory(@Body() createDto: CreateCategoryDto) {
    return this.categoryService.create(createDto);
  }

  @Get('admin/categories/list')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all commercial/industrial categories (Admin)' })
  async getAdminCategories(@Query() query: CategoryQueryDto) {
    return this.categoryService.findAll(query);
  }

  @Get('admin/categories/:categoryId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get single category (Admin)' })
  async getAdminCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.findOne(categoryId);
  }

  @Patch('categories/:categoryId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update category (Admin)' })
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(categoryId, updateDto);
  }

  @Delete('categories/:categoryId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category (Admin)' })
  @ApiResponse({ status: 400, description: 'Category is in use' })
  async deleteCategory(@Param('categoryId') categoryId: string) {
    await this.categoryService.remove(categoryId);
    return { success: true, message: 'Category deleted successfully' };
  }

  private createServiceForAccountTypes(
    createDto: CreateServiceDto,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, 'create services');
    return this.serviceService.create(createDto, user.userId);
  }

  private updateServiceForAccountTypes(
    serviceId: string,
    updateDto: UpdateServiceDto,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, 'update services');
    return this.serviceService.updateOwnedService(
      serviceId,
      updateDto,
      user.userId,
    );
  }

  private async deleteServiceForAccountTypes(
    serviceId: string,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, 'delete services');
    await this.serviceService.removeOwnedService(serviceId, user.userId);
  }

  private ensureAccountType(
    req: RequestWithUser,
    allowedTypes: string[],
    action: string,
  ) {
    const user = req.user;
    if (!user?.accountType) {
      throw new ForbiddenException('Invalid user context');
    }

    if (!allowedTypes.includes(user.accountType)) {
      throw new ForbiddenException(
        `Only ${allowedTypes.join('/')} accounts can ${action}`,
      );
    }

    if (!user.userId) {
      throw new ForbiddenException('Missing user identifier');
    }

    return user;
  }
}


