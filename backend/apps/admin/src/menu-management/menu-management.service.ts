import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MenuQueryDto } from "./dto/menu-query.dto";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { CreateNoticeDto } from "./dto/create-notice.dto";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { CreateGalleryDto } from "./dto/create-gallery.dto";
import { CreateSocialMediaDto } from "./dto/create-social-media.dto";
import { ReorderMenuDto } from "./dto/reorder-menu.dto";
import { BlogEntity } from "@/entities/blog.entity";

@Injectable()
export class MenuManagementService {
  private readonly logger = new Logger(MenuManagementService.name);

  constructor(
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
  ) {}

  // Branch Management
  async getBranches(query: MenuQueryDto) {
    // TODO: Integrate with content service
    this.logger.debug("Fetching branches", query);
    return {
      success: true,
      data: {
        branches: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      },
    };
  }

  async createBranch(createDto: CreateBranchDto) {
    this.logger.debug("Creating branch", createDto);
    return {
      success: true,
      message: "Branch created successfully",
      data: createDto,
    };
  }

  async updateBranch(branchId: string, updateDto: Partial<CreateBranchDto>) {
    this.logger.debug(`Updating branch ${branchId}`, updateDto);
    return {
      success: true,
      message: "Branch updated successfully",
      data: { branchId, ...updateDto },
    };
  }

  async deleteBranch(branchId: string) {
    this.logger.debug(`Deleting branch ${branchId}`);
    return {
      success: true,
      message: "Branch deleted successfully",
      data: { branchId },
    };
  }

  async toggleBranchVisibility(branchId: string) {
    this.logger.debug(`Toggling branch visibility ${branchId}`);
    return {
      success: true,
      message: "Branch visibility toggled",
      data: { branchId, visible: true },
    };
  }

  async reorderBranches(reorderDto: ReorderMenuDto[]) {
    this.logger.debug('Reordering branches', reorderDto);
    return {
      success: true,
      message: 'Branches reordered successfully',
      data: { reordered: reorderDto },
    };
  }

  // Notice Management
  async getNotices(query: MenuQueryDto) {
    this.logger.debug('Fetching notices', query);
    return {
      success: true,
      data: { notices: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
    };
  }

  async createNotice(createDto: CreateNoticeDto) {
    this.logger.debug('Creating notice', createDto);
    return { success: true, message: 'Notice created successfully', data: createDto };
  }

  async updateNotice(noticeId: string, updateDto: Partial<CreateNoticeDto>) {
    this.logger.debug(`Updating notice ${noticeId}`, updateDto);
    return { success: true, message: 'Notice updated successfully', data: { noticeId, ...updateDto } };
  }

  async deleteNotice(noticeId: string) {
    this.logger.debug(`Deleting notice ${noticeId}`);
    return { success: true, message: 'Notice deleted successfully', data: { noticeId } };
  }

  async toggleNoticeVisibility(noticeId: string) {
    this.logger.debug(`Toggling notice visibility ${noticeId}`);
    return { success: true, message: 'Notice visibility toggled', data: { noticeId, visible: true } };
  }

  async reorderNotices(reorderDto: ReorderMenuDto[]) {
    this.logger.debug('Reordering notices', reorderDto);
    return { success: true, message: 'Notices reordered successfully', data: { reordered: reorderDto } };
  }

  // Employee Management
  async getEmployees(query: MenuQueryDto) {
    this.logger.debug('Fetching employees', query);
    return {
      success: true,
      data: { employees: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
    };
  }

  async createEmployee(createDto: CreateEmployeeDto) {
    this.logger.debug('Creating employee', createDto);
    return { success: true, message: 'Employee created successfully', data: createDto };
  }

  async updateEmployee(employeeId: string, updateDto: Partial<CreateEmployeeDto>) {
    this.logger.debug(`Updating employee ${employeeId}`, updateDto);
    return { success: true, message: 'Employee updated successfully', data: { employeeId, ...updateDto } };
  }

  async deleteEmployee(employeeId: string) {
    this.logger.debug(`Deleting employee ${employeeId}`);
    return { success: true, message: 'Employee deleted successfully', data: { employeeId } };
  }

  async toggleEmployeeVisibility(employeeId: string) {
    this.logger.debug(`Toggling employee visibility ${employeeId}`);
    return { success: true, message: 'Employee visibility toggled', data: { employeeId, visible: true } };
  }

  async reorderEmployees(reorderDto: ReorderMenuDto[]) {
    this.logger.debug('Reordering employees', reorderDto);
    return { success: true, message: 'Employees reordered successfully', data: { reordered: reorderDto } };
  }

  // Blog Management
  async getBlogs(query: MenuQueryDto, adminId?: string) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.blogRepository.createQueryBuilder('blog');

      // Build search query - using ILIKE for simple text search
      if (query.search) {
        queryBuilder.andWhere(
          '(blog.title ILIKE :search OR blog.description ILIKE :search OR blog.tag ILIKE :search)',
          { search: `%${query.search}%` }
        );
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Fetch blogs with pagination and sorting
      const blogs = await queryBuilder
        .orderBy('blog.displayOrder', 'ASC')
        .addOrderBy('blog.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      const pages = Math.ceil(total / limit);

      this.logger.debug(`Fetched ${blogs.length} blogs`, {
        page,
        limit,
        total,
      });

      return {
        success: true,
        data: {
          blogs,
          pagination: {
            page,
            limit,
            total,
            pages,
          },
        },
      };
    } catch (error) {
      this.logger.error('Error fetching blogs', error);
      throw new BadRequestException('Failed to fetch blogs');
    }
  }

  async createBlog(createDto: CreateBlogDto, adminId: string) {
    try {
      const blog = this.blogRepository.create({
        title: createDto.title,
        slug: `blog-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        excerpt: createDto.description?.substring(0, 500) || '',
        content: createDto.description || '',
        featuredImage: createDto.photo || '',
        tags: createDto.tag ? createDto.tag.split(',').map(t => t.trim()) : [],
        isVisible: true,
        viewCount: 0,
        likeCount: 0,
        authorId: adminId,
      });

      const savedBlog = await this.blogRepository.save(blog);
      this.logger.debug(`Blog created: ${savedBlog.id}`, { adminId });

      return {
        success: true,
        message: 'Blog created successfully',
        data: savedBlog,
      };
    } catch (error) {
      this.logger.error('Error creating blog', error);
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        throw new BadRequestException('Blog with this ID already exists');
      }
      throw new BadRequestException('Failed to create blog');
    }
  }

  async updateBlog(blogId: string, updateDto: Partial<CreateBlogDto>, adminId: string) {
    try {
      const blog = await this.blogRepository.findOne({ where: { id: blogId } });
      if (!blog) {
        throw new NotFoundException(`Blog with ID ${blogId} not found`);
      }

      // Update fields
      if (updateDto.photo !== undefined) blog.featuredImage = updateDto.photo;
      if (updateDto.title !== undefined) blog.title = updateDto.title;
      if (updateDto.tag !== undefined) blog.tags = updateDto.tag.split(',').map(t => t.trim());
      if (updateDto.description !== undefined) {
        blog.content = updateDto.description;
        blog.excerpt = updateDto.description.substring(0, 500);
      }

      const updatedBlog = await this.blogRepository.save(blog);
      this.logger.debug(`Blog updated: ${blogId}`, { adminId });

      return {
        success: true,
        message: 'Blog updated successfully',
        data: updatedBlog,
      };
    } catch (error) {
      this.logger.error(`Error updating blog ${blogId}`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update blog');
    }
  }

  async deleteBlog(blogId: string) {
    try {
      const blog = await this.blogRepository.findOne({ where: { id: blogId } });
      if (!blog) {
        throw new NotFoundException(`Blog with ID ${blogId} not found`);
      }

      await this.blogRepository.remove(blog);
      this.logger.debug(`Blog deleted: ${blogId}`);

      return {
        success: true,
        message: 'Blog deleted successfully',
        data: { blogId },
      };
    } catch (error) {
      this.logger.error(`Error deleting blog ${blogId}`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete blog');
    }
  }

  async toggleBlogVisibility(blogId: string, adminId: string) {
    try {
      const blog = await this.blogRepository.findOne({ where: { id: blogId } });
      if (!blog) {
        throw new NotFoundException(`Blog with ID ${blogId} not found`);
      }

      blog.isVisible = !blog.isVisible;
      const updatedBlog = await this.blogRepository.save(blog);

      this.logger.debug(`Blog visibility toggled: ${blogId}`, {
        isVisible: updatedBlog.isVisible,
        adminId,
      });

      return {
        success: true,
        message: 'Blog visibility toggled successfully',
        data: {
          blogId,
          isVisible: updatedBlog.isVisible,
        },
      };
    } catch (error) {
      this.logger.error(`Error toggling blog visibility ${blogId}`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to toggle blog visibility');
    }
  }

  async reorderBlogs(reorderDto: ReorderMenuDto[], adminId: string) {
    try {
      throw new BadRequestException('Blog reordering is not supported - displayOrder field does not exist');
    } catch (error) {
      this.logger.error('Error reordering blogs', error);
      throw new BadRequestException('Failed to reorder blogs');
    }
  }

  // Contact Us Management
  async getContacts(query: MenuQueryDto) {
    this.logger.debug("Fetching contacts", query);
    return {
      success: true,
      data: {
        contacts: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      },
    };
  }

  async deleteContact(contactId: string) {
    this.logger.debug(`Deleting contact ${contactId}`);
    return {
      success: true,
      message: "Contact deleted successfully",
      data: { contactId },
    };
  }

  async deleteContacts(contactIds: string[]) {
    this.logger.debug(`Deleting multiple contacts`, contactIds);
    return {
      success: true,
      message: "Contacts deleted successfully",
      data: { deleted: contactIds },
    };
  }

  // Company Management
  async getCompanies(query: MenuQueryDto) {
    this.logger.debug("Fetching companies", query);
    return {
      success: true,
      data: {
        companies: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      },
    };
  }

  async createCompany(createDto: CreateCompanyDto) {
    this.logger.debug("Creating company", createDto);
    return {
      success: true,
      message: "Company created successfully",
      data: createDto,
    };
  }

  async addCompanyDescription(categoryId: string, description: string) {
    this.logger.debug(`Adding description to company category ${categoryId}`);
    return {
      success: true,
      message: "Description added successfully",
      data: { categoryId, description },
    };
  }

  async deleteCompany(categoryId: string) {
    this.logger.debug(`Deleting company category ${categoryId}`);
    return {
      success: true,
      message: "Company deleted successfully",
      data: { categoryId },
    };
  }

  async toggleCompanyVisibility(categoryId: string) {
    this.logger.debug(`Toggling company visibility ${categoryId}`);
    return {
      success: true,
      message: "Company visibility toggled",
      data: { categoryId, visible: true },
    };
  }

  // Gallery Management
  async getGalleries(query: MenuQueryDto) {
    this.logger.debug("Fetching galleries", query);
    return {
      success: true,
      data: {
        galleries: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      },
    };
  }

  async getGalleryImages(categoryId: string) {
    this.logger.debug(`Fetching gallery images for category ${categoryId}`);
    return {
      success: true,
      data: { categoryId, images: [] },
    };
  }

  async createGallery(createDto: CreateGalleryDto) {
    this.logger.debug("Creating gallery", createDto);
    return {
      success: true,
      message: "Gallery created successfully",
      data: createDto,
    };
  }

  async addGalleryImages(categoryId: string, images: Array<{ image: string; title: string }>) {
    this.logger.debug(`Adding images to gallery category ${categoryId}`);
    return {
      success: true,
      message: "Images added successfully",
      data: { categoryId, images },
    };
  }

  async deleteGallery(categoryId: string) {
    this.logger.debug(`Deleting gallery category ${categoryId}`);
    return {
      success: true,
      message: "Gallery deleted successfully",
      data: { categoryId },
    };
  }

  async toggleGalleryVisibility(categoryId: string) {
    this.logger.debug(`Toggling gallery visibility ${categoryId}`);
    return {
      success: true,
      message: "Gallery visibility toggled",
      data: { categoryId, visible: true },
    };
  }

  // Social Media Management
  async getSocialMedia() {
    this.logger.debug("Fetching social media links");
    return {
      success: true,
      data: { socialMedia: [] },
    };
  }

  async createSocialMedia(createDto: CreateSocialMediaDto) {
    this.logger.debug("Creating social media", createDto);
    return {
      success: true,
      message: "Social media created successfully",
      data: createDto,
    };
  }

  async deleteSocialMedia(socialMediaId: string) {
    this.logger.debug(`Deleting social media ${socialMediaId}`);
    return {
      success: true,
      message: "Social media deleted successfully",
      data: { socialMediaId },
    };
  }

  // Support Logo Management
  async getSupportLogos() {
    this.logger.debug("Fetching support logos");
    return {
      success: true,
      data: { logos: [] },
    };
  }

  async createSupportLogo(logo: string) {
    this.logger.debug("Creating support logo");
    return {
      success: true,
      message: "Support logo created successfully",
      data: { logo },
    };
  }

  async deleteSupportLogo(logoId: string) {
    this.logger.debug(`Deleting support logo ${logoId}`);
    return {
      success: true,
      message: "Support logo deleted successfully",
      data: { logoId },
    };
  }
}