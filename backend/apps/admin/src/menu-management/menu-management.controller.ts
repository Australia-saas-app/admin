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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { MenuManagementService } from './menu-management.service';
import { MenuQueryDto } from './dto/menu-query.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { ReorderMenuDto } from './dto/reorder-menu.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { AdminRequest } from '../common/interfaces/request.interface';

@ApiTags('menu')
@Controller('menu')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MenuManagementController {
  constructor(
    private readonly menuManagementService: MenuManagementService,
  ) {}

  // Branch Management
  @Get('branches')
  @ApiOperation({ summary: 'Get all branches' })
  getBranches(@Query() query: MenuQueryDto) {
    return this.menuManagementService.getBranches(query);
  }

  @Post('branches')
  @ApiOperation({ summary: 'Create branch' })
  createBranch(@Body() createDto: CreateBranchDto) {
    return this.menuManagementService.createBranch(createDto);
  }

  @Patch('branches/:branchId')
  @ApiOperation({ summary: 'Update branch' })
  updateBranch(@Param('branchId') branchId: string, @Body() updateDto: Partial<CreateBranchDto>) {
    return this.menuManagementService.updateBranch(branchId, updateDto);
  }

  @Delete('branches/:branchId')
  @ApiOperation({ summary: 'Delete branch' })
  deleteBranch(@Param('branchId') branchId: string) {
    return this.menuManagementService.deleteBranch(branchId);
  }

  @Patch('branches/:branchId/visibility')
  @ApiOperation({ summary: 'Toggle branch visibility' })
  toggleBranchVisibility(@Param('branchId') branchId: string) {
    return this.menuManagementService.toggleBranchVisibility(branchId);
  }

  @Post('branches/reorder')
  @ApiOperation({ summary: 'Reorder branches' })
  reorderBranches(@Body() reorderDto: ReorderMenuDto[]) {
    return this.menuManagementService.reorderBranches(reorderDto);
  }

  // Notice Management
  @Get('notices')
  @ApiOperation({ summary: 'Get all notices' })
  getNotices(@Query() query: MenuQueryDto) {
    return this.menuManagementService.getNotices(query);
  }

  @Post('notices')
  @ApiOperation({ summary: 'Create notice' })
  createNotice(@Body() createDto: CreateNoticeDto) {
    return this.menuManagementService.createNotice(createDto);
  }

  @Patch('notices/:noticeId')
  @ApiOperation({ summary: 'Update notice' })
  updateNotice(@Param('noticeId') noticeId: string, @Body() updateDto: Partial<CreateNoticeDto>) {
    return this.menuManagementService.updateNotice(noticeId, updateDto);
  }

  @Delete('notices/:noticeId')
  @ApiOperation({ summary: 'Delete notice' })
  deleteNotice(@Param('noticeId') noticeId: string) {
    return this.menuManagementService.deleteNotice(noticeId);
  }

  @Patch('notices/:noticeId/visibility')
  @ApiOperation({ summary: 'Toggle notice visibility' })
  toggleNoticeVisibility(@Param('noticeId') noticeId: string) {
    return this.menuManagementService.toggleNoticeVisibility(noticeId);
  }

  @Post('notices/reorder')
  @ApiOperation({ summary: 'Reorder notices' })
  reorderNotices(@Body() reorderDto: ReorderMenuDto[]) {
    return this.menuManagementService.reorderNotices(reorderDto);
  }

  // Employee Management
  @Get('employees')
  @ApiOperation({ summary: 'Get all employees' })
  getEmployees(@Query() query: MenuQueryDto) {
    return this.menuManagementService.getEmployees(query);
  }

  @Post('employees')
  @ApiOperation({ summary: 'Create employee' })
  createEmployee(@Body() createDto: CreateEmployeeDto) {
    return this.menuManagementService.createEmployee(createDto);
  }

  @Patch('employees/:employeeId')
  @ApiOperation({ summary: 'Update employee' })
  updateEmployee(@Param('employeeId') employeeId: string, @Body() updateDto: Partial<CreateEmployeeDto>) {
    return this.menuManagementService.updateEmployee(employeeId, updateDto);
  }

  @Delete('employees/:employeeId')
  @ApiOperation({ summary: 'Delete employee' })
  deleteEmployee(@Param('employeeId') employeeId: string) {
    return this.menuManagementService.deleteEmployee(employeeId);
  }

  @Patch('employees/:employeeId/visibility')
  @ApiOperation({ summary: 'Toggle employee visibility' })
  toggleEmployeeVisibility(@Param('employeeId') employeeId: string) {
    return this.menuManagementService.toggleEmployeeVisibility(employeeId);
  }

  @Post('employees/reorder')
  @ApiOperation({ summary: 'Reorder employees' })
  reorderEmployees(@Body() reorderDto: ReorderMenuDto[]) {
    return this.menuManagementService.reorderEmployees(reorderDto);
  }

  // Blog Management
  @Get('blogs')
  @ApiOperation({ summary: 'Get all blogs with pagination and search' })
  @ApiResponse({ status: 200, description: 'Blogs retrieved successfully' })
  getBlogs(@Query() query: MenuQueryDto, @Request() req: AdminRequest) {
    const adminId = req.admin?.adminId || req.admin?.email || 'system';
    return this.menuManagementService.getBlogs(query, adminId);
  }

  @Post('blogs')
  @ApiOperation({ summary: 'Create blog' })
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  createBlog(@Body() createDto: CreateBlogDto, @Request() req: AdminRequest) {
    const adminId = req.admin?.adminId || req.admin?.email || 'system';
    return this.menuManagementService.createBlog(createDto, adminId);
  }

  @Patch('blogs/:blogId')
  @ApiOperation({ summary: 'Update blog' })
  @ApiParam({ name: 'blogId', description: 'Blog ID' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  updateBlog(
    @Param('blogId') blogId: string,
    @Body() updateDto: Partial<CreateBlogDto>,
    @Request() req: AdminRequest,
  ) {
    const adminId = req.admin?.adminId || req.admin?.email || 'system';
    return this.menuManagementService.updateBlog(blogId, updateDto, adminId);
  }

  @Delete('blogs/:blogId')
  @ApiOperation({ summary: 'Delete blog' })
  @ApiParam({ name: 'blogId', description: 'Blog ID' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  deleteBlog(@Param('blogId') blogId: string) {
    return this.menuManagementService.deleteBlog(blogId);
  }

  @Patch('blogs/:blogId/visibility')
  @ApiOperation({ summary: 'Toggle blog visibility' })
  @ApiParam({ name: 'blogId', description: 'Blog ID' })
  @ApiResponse({ status: 200, description: 'Blog visibility toggled successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  toggleBlogVisibility(@Param('blogId') blogId: string, @Request() req: AdminRequest) {
    const adminId = req.admin?.adminId || req.admin?.email || 'system';
    return this.menuManagementService.toggleBlogVisibility(blogId, adminId);
  }

  @Post('blogs/reorder')
  @ApiOperation({ summary: 'Reorder blogs' })
  @ApiResponse({ status: 200, description: 'Blogs reordered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid reorder data' })
  reorderBlogs(@Body() reorderDto: ReorderMenuDto[], @Request() req: AdminRequest) {
    const adminId = req.admin?.adminId || req.admin?.email || 'system';
    return this.menuManagementService.reorderBlogs(reorderDto, adminId);
  }

  // Contact Us Management
  @Get('contacts')
  @ApiOperation({ summary: 'Get all contacts' })
  getContacts(@Query() query: MenuQueryDto) {
    return this.menuManagementService.getContacts(query);
  }

  @Delete('contacts/:contactId')
  @ApiOperation({ summary: 'Delete single contact' })
  deleteContact(@Param('contactId') contactId: string) {
    return this.menuManagementService.deleteContact(contactId);
  }

  @Delete('contacts')
  @ApiOperation({ summary: 'Delete multiple contacts' })
  deleteContacts(@Body('contactIds') contactIds: string[]) {
    return this.menuManagementService.deleteContacts(contactIds);
  }

  // Company Management
  @Get('companies')
  @ApiOperation({ summary: 'Get all company categories' })
  getCompanies(@Query() query: MenuQueryDto) {
    return this.menuManagementService.getCompanies(query);
  }

  @Post('companies')
  @ApiOperation({ summary: 'Create company category' })
  createCompany(@Body() createDto: CreateCompanyDto) {
    return this.menuManagementService.createCompany(createDto);
  }

  @Post('companies/:categoryId/descriptions')
  @ApiOperation({ summary: 'Add description to company category' })
  addCompanyDescription(@Param('categoryId') categoryId: string, @Body('description') description: string) {
    return this.menuManagementService.addCompanyDescription(categoryId, description);
  }

  @Delete('companies/:categoryId')
  @ApiOperation({ summary: 'Delete company category' })
  deleteCompany(@Param('categoryId') categoryId: string) {
    return this.menuManagementService.deleteCompany(categoryId);
  }

  @Patch('companies/:categoryId/visibility')
  @ApiOperation({ summary: 'Toggle company visibility' })
  toggleCompanyVisibility(@Param('categoryId') categoryId: string) {
    return this.menuManagementService.toggleCompanyVisibility(categoryId);
  }

  // Gallery Management
  @Get('galleries')
  @ApiOperation({ summary: 'Get all gallery categories' })
  getGalleries(@Query() query: MenuQueryDto) {
    return this.menuManagementService.getGalleries(query);
  }

  @Get('galleries/:categoryId/images')
  @ApiOperation({ summary: 'Get gallery images by category' })
  getGalleryImages(@Param('categoryId') categoryId: string) {
    return this.menuManagementService.getGalleryImages(categoryId);
  }

  @Post('galleries')
  @ApiOperation({ summary: 'Create gallery category' })
  createGallery(@Body() createDto: CreateGalleryDto) {
    return this.menuManagementService.createGallery(createDto);
  }

  @Post('galleries/:categoryId/images')
  @ApiOperation({ summary: 'Add images to gallery category' })
  addGalleryImages(@Param('categoryId') categoryId: string, @Body('images') images: Array<{ image: string; title: string }>) {
    return this.menuManagementService.addGalleryImages(categoryId, images);
  }

  @Delete('galleries/:categoryId')
  @ApiOperation({ summary: 'Delete gallery category' })
  deleteGallery(@Param('categoryId') categoryId: string) {
    return this.menuManagementService.deleteGallery(categoryId);
  }

  @Patch('galleries/:categoryId/visibility')
  @ApiOperation({ summary: 'Toggle gallery visibility' })
  toggleGalleryVisibility(@Param('categoryId') categoryId: string) {
    return this.menuManagementService.toggleGalleryVisibility(categoryId);
  }

  // Social Media Management
  @Get('social-media')
  @ApiOperation({ summary: 'Get all social media links' })
  getSocialMedia() {
    return this.menuManagementService.getSocialMedia();
  }

  @Post('social-media')
  @ApiOperation({ summary: 'Create social media link' })
  createSocialMedia(@Body() createDto: CreateSocialMediaDto) {
    return this.menuManagementService.createSocialMedia(createDto);
  }

  @Delete('social-media/:socialMediaId')
  @ApiOperation({ summary: 'Delete social media link' })
  deleteSocialMedia(@Param('socialMediaId') socialMediaId: string) {
    return this.menuManagementService.deleteSocialMedia(socialMediaId);
  }

  // Support Logo Management
  @Get('support-logos')
  @ApiOperation({ summary: 'Get all support logos' })
  getSupportLogos() {
    return this.menuManagementService.getSupportLogos();
  }

  @Post('support-logos')
  @ApiOperation({ summary: 'Create support logo' })
  createSupportLogo(@Body('logo') logo: string) {
    return this.menuManagementService.createSupportLogo(logo);
  }

  @Delete('support-logos/:logoId')
  @ApiOperation({ summary: 'Delete support logo' })
  deleteSupportLogo(@Param('logoId') logoId: string) {
    return this.menuManagementService.deleteSupportLogo(logoId);
  }
}

