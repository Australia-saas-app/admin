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
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RealEstatePropertyService } from './services/real-estate-property.service';
import { RealEstateCategoryService } from './services/real-estate-category.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  PropertyQueryDto,
  CategoryQueryDto,
  ReorderDto,
} from './dto/query-params.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestWithAdmin, RequestWithUser } from '../common/interfaces/request.interface';

@ApiTags('properties')
@Controller('properties')
export class RealEstateController {
  constructor(
    private readonly realEstatePropertyService: RealEstatePropertyService,
    private readonly realEstateCategoryService: RealEstateCategoryService,
  ) {}

  // ==========================================
  // PUBLIC ROUTES - Properties
  // ==========================================

  @Get()
  @ApiOperation({ summary: 'Get all visible real estate properties (Public)' })
  @ApiResponse({ status: 200, description: 'List of properties' })
  async getProperties(@Query() query: PropertyQueryDto, @Req() req: Request) {
    // Handle empty string in query params (transform might not catch it)
    const rawIsVisible = req.query?.isVisible as string | undefined;
    if (rawIsVisible === '' || rawIsVisible === null || rawIsVisible === undefined) {
      // If raw query param is empty, set to undefined (public endpoint always shows visible only)
      query.isVisible = undefined;
    }
    
    // Handle empty price parameters - if they're 0 or empty string, set to undefined
    const rawMinPrice = req.query?.minPrice as string | undefined;
    if (rawMinPrice === '' || rawMinPrice === null || rawMinPrice === undefined) {
      query.minPrice = undefined;
    } else if (query.minPrice === 0 && rawMinPrice !== '0') {
      // If DTO converted empty string to 0, but raw was empty, set to undefined
      query.minPrice = undefined;
    }
    
    const rawMaxPrice = req.query?.maxPrice as string | undefined;
    if (rawMaxPrice === '' || rawMaxPrice === null || rawMaxPrice === undefined) {
      query.maxPrice = undefined;
    } else if (query.maxPrice === 0 && rawMaxPrice !== '0') {
      // If DTO converted empty string to 0, but raw was empty, set to undefined
      query.maxPrice = undefined;
    }
    
    return this.realEstatePropertyService.findAll(query, false);
  }

  // ==========================================
  // AUTHENTICATED USER/AGENCY ROUTES - Properties
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create real estate property (User/Agency/Business)' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createProperty(
    @Body() createDto: CreatePropertyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createPropertyForAccountTypes(createDto, req, [
      'user',
      'agency',
      'business',
    ]);
  }

  @Post('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create real estate property (User only)' })
  async createUserProperty(
    @Body() createDto: CreatePropertyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createPropertyForAccountTypes(createDto, req, ['user']);
  }

  @Post('agent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create real estate property (Agent/Agency only)' })
  async createAgentProperty(
    @Body() createDto: CreatePropertyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.createPropertyForAccountTypes(createDto, req, ['agency']);
  }

  @Get('admin/list')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all real estate properties (Admin)' })
  @ApiResponse({ status: 200, description: 'List of all properties' })
  async getAdminProperties(@Query() query: PropertyQueryDto, @Req() req: Request) {
    // Handle empty string in query params (transform might not catch it)
    const rawIsVisible = req.query?.isVisible as string | undefined;
    if (rawIsVisible === '' || rawIsVisible === null || rawIsVisible === undefined) {
      // If raw query param is empty, set to undefined to show all properties
      query.isVisible = undefined;
    }
    return this.realEstatePropertyService.findAll(query, true);
  }

  @Get('admin/:propertyId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get single real estate property (Admin)' })
  async getAdminProperty(@Param('propertyId') propertyId: string) {
    return this.realEstatePropertyService.findOne(propertyId, true);
  }

  // Public route for single property (must come after admin routes)
  @Get(':propertyId')
  @ApiOperation({ summary: 'Get single real estate property (Public)' })
  @ApiResponse({ status: 200, description: 'Property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getProperty(@Param('propertyId') propertyId: string) {
    return this.realEstatePropertyService.findOne(propertyId, false);
  }

  @Patch(':propertyId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update real estate property (Admin)' })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async updateProperty(
    @Param('propertyId') propertyId: string,
    @Body() updateDto: UpdatePropertyDto,
    @Req() req: RequestWithAdmin,
  ) {
    return this.realEstatePropertyService.update(
      propertyId,
      updateDto,
      req.admin?.email || 'system',
    );
  }

  @Delete(':propertyId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete real estate property (Admin)' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async deleteProperty(@Param('propertyId') propertyId: string) {
    await this.realEstatePropertyService.remove(propertyId);
    return { success: true, message: 'Property deleted successfully' };
  }

  @Patch('user/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update real estate property (User owns property)' })
  async updateUserProperty(
    @Param('propertyId') propertyId: string,
    @Body() updateDto: UpdatePropertyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.updatePropertyForAccountTypes(
      propertyId,
      updateDto,
      req,
      ['user'],
    );
  }

  @Patch('agent/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update real estate property (Agent/Agency owns property)' })
  async updateAgentProperty(
    @Param('propertyId') propertyId: string,
    @Body() updateDto: UpdatePropertyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.updatePropertyForAccountTypes(
      propertyId,
      updateDto,
      req,
      ['agency'],
    );
  }

  @Delete('user/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete real estate property (User owns property)' })
  async deleteUserProperty(
    @Param('propertyId') propertyId: string,
    @Req() req: RequestWithUser,
  ) {
    await this.deletePropertyForAccountTypes(propertyId, req, ['user']);
    return { success: true, message: 'Property deleted successfully' };
  }

  @Delete('agent/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete real estate property (Agent/Agency owns property)' })
  async deleteAgentProperty(
    @Param('propertyId') propertyId: string,
    @Req() req: RequestWithUser,
  ) {
    await this.deletePropertyForAccountTypes(propertyId, req, ['agency']);
    return { success: true, message: 'Property deleted successfully' };
  }

  @Patch(':propertyId/visibility')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle property visibility (Admin)' })
  @ApiResponse({ status: 200, description: 'Visibility updated' })
  async toggleVisibility(
    @Param('propertyId') propertyId: string,
    @Body('isVisible') isVisible: boolean,
    @Req() req: RequestWithAdmin,
  ) {
    return this.realEstatePropertyService.toggleVisibility(
      propertyId,
      isVisible,
      req.admin?.email || 'system',
    );
  }

  @Patch(':propertyId/reorder')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reorder property (Admin)' })
  @ApiResponse({ status: 200, description: 'Property reordered' })
  async reorderProperty(
    @Param('propertyId') propertyId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    return this.realEstatePropertyService.reorder(propertyId, reorderDto.direction);
  }

  // ==========================================
  // PUBLIC ROUTES - Categories
  // ==========================================

  @Get('categories/list')
  @ApiOperation({ summary: 'Get all active real estate categories (Public)' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async getCategories(@Query() query: CategoryQueryDto) {
    const activeQuery = { ...query, isActive: true };
    return this.realEstateCategoryService.findAll(activeQuery);
  }

  // ==========================================
  // ADMIN ROUTES - Categories
  // ==========================================

  @Post('categories')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create real estate category (Admin)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  async createCategory(@Body() createDto: CreateCategoryDto) {
    return this.realEstateCategoryService.create(createDto);
  }

  @Get('admin/categories/list')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all real estate categories (Admin)' })
  async getAdminCategories(@Query() query: CategoryQueryDto) {
    return this.realEstateCategoryService.findAll(query);
  }

  @Get('admin/categories/:categoryId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get single category (Admin)' })
  async getAdminCategory(@Param('categoryId') categoryId: string) {
    return this.realEstateCategoryService.findOne(categoryId);
  }

  @Patch('categories/:categoryId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update category (Admin)' })
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return this.realEstateCategoryService.update(categoryId, updateDto);
  }

  @Delete('categories/:categoryId')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category (Admin)' })
  @ApiResponse({ status: 400, description: 'Category is in use' })
  async deleteCategory(@Param('categoryId') categoryId: string) {
    await this.realEstateCategoryService.remove(categoryId);
    return { success: true, message: 'Category deleted successfully' };
  }

  private createPropertyForAccountTypes(
    createDto: CreatePropertyDto,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, 'create properties');
    return this.realEstatePropertyService.create(createDto, user.userId);
  }

  private updatePropertyForAccountTypes(
    propertyId: string,
    updateDto: UpdatePropertyDto,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, 'update properties');
    return this.realEstatePropertyService.updateOwnedProperty(
      propertyId,
      updateDto,
      user.userId,
    );
  }

  private async deletePropertyForAccountTypes(
    propertyId: string,
    req: RequestWithUser,
    allowedTypes: string[],
  ) {
    const user = this.ensureAccountType(req, allowedTypes, 'delete properties');
    await this.realEstatePropertyService.removeOwnedProperty(
      propertyId,
      user.userId,
    );
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


