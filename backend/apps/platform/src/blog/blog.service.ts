import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { BlogFileStorageService } from "./blog-file-storage.service";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly blogFileStorageService: BlogFileStorageService,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{
    data: BlogEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      this.blogRepository.find({
        where: { isVisible: true },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.blogRepository.count({ where: { isVisible: true } }),
    ]);

    return {
      data: blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllAdmin(page: number = 1, limit: number = 20): Promise<{
    data: BlogEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      this.blogRepository.find({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['author'],
      }),
      this.blogRepository.count(),
    ]);

    return {
      data: blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BlogEntity> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findCategories(): Promise<string[]> {
    const blogs = await this.blogRepository
      .createQueryBuilder('blog')
      .select('category')
      .where('blog.isVisible = :isVisible', { isVisible: true })
      .distinct(true)
      .getRawMany();

    return blogs.map(blog => blog.category).filter((cat, index) => cat !== null && index > -1);
  }

  async create(createBlogDto: {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    photo?: {
      fileId?: string;
      fileKey?: string;
      url?: string;
      fileName?: string;
      mimeType?: string;
      size?: number;
    };
    isVisible?: boolean;
    slug?: string;
  }, authorId: string): Promise<BlogEntity> {
    const slug = createBlogDto.slug || this.generateSlug(createBlogDto.title);
    
    const blog = this.blogRepository.create({
      title: createBlogDto.title,
      slug: slug,
      content: createBlogDto.content,
      excerpt: createBlogDto.excerpt,
      category: createBlogDto.category,
      tags: createBlogDto.tags,
      photo: createBlogDto.photo,
      isVisible: createBlogDto.isVisible ?? true,
      authorId: authorId,
    });

    return await this.blogRepository.save(blog);
  }

  async update(id: string, updateBlogDto: {
    title?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    photo?: {
      fileId?: string;
      fileKey?: string;
      url?: string;
      fileName?: string;
      mimeType?: string;
      size?: number;
    };
    isVisible?: boolean;
    slug?: string;
    authorId?: string;
  }, authorId?: string): Promise<BlogEntity> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (updateBlogDto.title) {
      blog.title = updateBlogDto.title;
      blog.slug = updateBlogDto.slug || this.generateSlug(updateBlogDto.title);
    }
    if (updateBlogDto.content !== undefined) blog.content = updateBlogDto.content;
    if (updateBlogDto.excerpt !== undefined) blog.excerpt = updateBlogDto.excerpt;
    if (updateBlogDto.category !== undefined) blog.category = updateBlogDto.category;
    if (updateBlogDto.tags !== undefined) blog.tags = updateBlogDto.tags;
    if (updateBlogDto.photo !== undefined) blog.photo = updateBlogDto.photo;
    if (updateBlogDto.isVisible !== undefined) blog.isVisible = updateBlogDto.isVisible;

    if (updateBlogDto.authorId && authorId !== blog.authorId) {
      throw new NotFoundException('Cannot change blog author');
    }

    return await this.blogRepository.save(blog);
  }

  async uploadPhoto(
    id: string,
    file: Express.Multer.File,
  ): Promise<BlogEntity> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const folderId = await this.blogFileStorageService.getBlogFolderId();
    const uploadResult = await this.blogFileStorageService.uploadFile(file, folderId);

    blog.photo = {
      fileId: uploadResult.id,
      fileKey: uploadResult.key,
      url: uploadResult.url,
      fileName: uploadResult.fileName,
      mimeType: uploadResult.mimeType,
      size: uploadResult.size,
    };

    return await this.blogRepository.save(blog);
  }

  async toggleVisibility(id: string): Promise<BlogEntity> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    blog.isVisible = !blog.isVisible;
    
    return await this.blogRepository.save(blog);
  }

  async delete(id: string): Promise<void> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    
    if (blog?.photo?.fileId) {
      await this.blogFileStorageService.deleteFile(blog.photo.fileId);
    }

    await this.blogRepository.createQueryBuilder('blog')
      .delete()
      .where("id = :id", { id })
      .execute();
  }

  async count(): Promise<number> {
    return await this.blogRepository.count({ where: { isVisible: true } });
  }

  async getBlogFolderId(): Promise<string> {
    return this.blogFileStorageService.getBlogFolderId();
  }

  async uploadFileToStorage(
    file: Express.Multer.File,
    folderId: string,
  ): Promise<{ id: string; key: string; url?: string; fileName: string; mimeType: string; size: number }> {
    return this.blogFileStorageService.uploadFile(file, folderId);
  }

  async search(name: string): Promise<BlogEntity[]> {
    return this.blogRepository
      .createQueryBuilder("blog")
      .where("blog.title ILIKE :name", { name: `%${name}%` })
      .orderBy("blog.createdAt", "DESC")
      .getMany();
  }
}
