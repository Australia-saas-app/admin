import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiQuery,
} from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { BlogFileStorageService } from "./blog-file-storage.service";
import { PlatformAuthGuard } from "../common/guards/platform-auth.guard";
import { CreateBlogDto, UpdateBlogDto } from "./dto/blog.dto";
import { Request } from "express";

@ApiTags("admin-blogs")
@Controller("admin/blogs")
@UseGuards(PlatformAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AdminBlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogFileStorageService: BlogFileStorageService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all blog posts (Admin)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiBearerAuth()
  async getAllBlogs(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.blogService.findAllAdmin(Number(page), Number(limit));
  }

  @Get("categories")
  @ApiOperation({ summary: "Get all existing categories" })
  @ApiBearerAuth()
  async getCategories() {
    const categories = await this.blogService.findCategories();
    return { data: categories };
  }

  @Post()
  @ApiOperation({ summary: "Create a new blog post" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const authorId = (req as any).admin?.adminId || null;
    let photo = createBlogDto.photo;

    if (file) {
      const folderId = await this.blogService.getBlogFolderId();
      const uploadResult = await this.blogService.uploadFileToStorage(file, folderId);

      photo = {
        fileId: uploadResult.id,
        fileKey: uploadResult.key,
        url: uploadResult.url,
        fileName: uploadResult.fileName,
        mimeType: uploadResult.mimeType,
        size: String(uploadResult.size),
      };
    }

    const blog = await this.blogService.create({
      title: createBlogDto.title,
      content: createBlogDto.content,
      excerpt: createBlogDto.excerpt,
      category: createBlogDto.category,
      tags: createBlogDto.tags,
      photo: photo ? {
        fileId: photo.fileId,
        fileKey: photo.fileKey,
        url: photo.url,
        fileName: photo.fileName,
        mimeType: photo.mimeType,
        size: photo.size ? parseInt(photo.size as any) : undefined,
      } : undefined,
      isVisible: createBlogDto.isVisible === 'true' ? true : createBlogDto.isVisible === 'false' ? false : undefined,
    }, authorId);

    return {
      message: "Blog post created successfully",
      data: blog,
    };
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update blog post" })
  @ApiParam({ name: "id", description: "Blog post ID" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async updateBlog(
    @Param("id") id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let photo = updateBlogDto.photo;

    if (file) {
      const folderId = await this.blogService.getBlogFolderId();
      const uploadResult = await this.blogService.uploadFileToStorage(file, folderId);

      photo = {
        fileId: uploadResult.id,
        fileKey: uploadResult.key,
        url: uploadResult.url,
        fileName: uploadResult.fileName,
        mimeType: uploadResult.mimeType,
        size: String(uploadResult.size),
      };
    }

    const blog = await this.blogService.update(id, {
      title: updateBlogDto.title,
      content: updateBlogDto.content,
      excerpt: updateBlogDto.excerpt,
      category: updateBlogDto.category,
      tags: updateBlogDto.tags,
      photo: photo ? {
        fileId: photo.fileId,
        fileKey: photo.fileKey,
        url: photo.url,
        fileName: photo.fileName,
        mimeType: photo.mimeType,
        size: photo.size ? parseInt(photo.size as any) : undefined,
      } : undefined,
      isVisible: updateBlogDto.isVisible === 'true' ? true : updateBlogDto.isVisible === 'false' ? false : undefined,
    });

    return {
      message: "Blog post updated successfully",
      data: blog,
    };
  }

  @Post(":id/photo")
  @ApiOperation({ summary: "Upload photo to blog post" })
  @ApiParam({ name: "id", description: "Blog post ID" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async uploadPhoto(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    const blog = await this.blogService.uploadPhoto(id, file);
    return {
      message: "Photo uploaded successfully",
      data: blog,
    };
  }

  @Patch(":id/visibility")
  @ApiOperation({ summary: "Toggle blog post visibility" })
  @ApiParam({ name: "id", description: "Blog post ID" })
  @ApiBearerAuth()
  async toggleBlogVisibility(@Param("id") id: string) {
    const blog = await this.blogService.toggleVisibility(id);
    return {
      message: "Blog visibility toggled successfully",
      data: blog,
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a blog post" })
  @ApiParam({ name: "id", description: "Blog post ID" })
  @ApiBearerAuth()
  async deleteBlog(@Param("id") id: string) {
    await this.blogService.delete(id);
    return { message: "Blog post deleted successfully" };
  }
}
