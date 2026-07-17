import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Gallery } from "../entities/gallery.entity";
import { FileStorageService } from "./file-storage.service";
import { MediaType } from "../entities/gallery.entity";

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
    private fileStorageService: FileStorageService,
  ) {}

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [galleries, total] = await Promise.all([
      this.galleryRepository.find({
        where: { isVisible: true },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.galleryRepository.count({ where: { isVisible: true } }),
    ]);

    return {
      data: galleries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException("Gallery not found");
    }
    return gallery;
  }

  async findByCategory(category: string) {
    return await this.galleryRepository.find({
      where: { category, isVisible: true },
      order: { createdAt: 'DESC' },
    });
  }

  async search(name: string): Promise<Gallery[]> {
    return this.galleryRepository
      .createQueryBuilder("gallery")
      .where("gallery.title ILIKE :name", { name: `%${name}%` })
      .orderBy("gallery.createdAt", "DESC")
      .getMany();
  }

  async create(createGalleryDto: {
    title?: string;
    category?: string;
    description?: string;
    media?: {
      fileId?: string;
      fileKey?: string;
      url?: string;
      type?: MediaType;
      fileName?: string;
      mimeType?: string;
      size?: number;
    };
    images?: { imageUrl: string; altText?: string; displayOrder?: number }[];
    isVisible?: boolean;
    createdBy?: string;
  }) {
    const images = (createGalleryDto.images || []).map((img, index) => ({
      ...img,
      displayOrder: img.displayOrder ?? index,
    }));

    const gallery = this.galleryRepository.create({
      title: createGalleryDto.title,
      category: createGalleryDto.category,
      description: createGalleryDto.description,
      media: createGalleryDto.media,
      images,
      isVisible: createGalleryDto.isVisible ?? true,
      createdBy: createGalleryDto.createdBy,
    });

    return await this.galleryRepository.save(gallery);
  }

  async update(
    id: string,
    updateGalleryDto: {
      title?: string;
      category?: string;
      description?: string;
      media?: {
        fileId?: string;
        fileKey?: string;
        url?: string;
        type?: MediaType;
        fileName?: string;
        mimeType?: string;
        size?: number;
      };
      images?: { imageUrl: string; altText?: string; displayOrder?: number }[];
      isVisible?: boolean;
    }
  ) {
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException("Gallery not found");
    }

    if (updateGalleryDto.title !== undefined) gallery.title = updateGalleryDto.title;
    if (updateGalleryDto.category !== undefined) gallery.category = updateGalleryDto.category;
    if (updateGalleryDto.description !== undefined) gallery.description = updateGalleryDto.description;
    if (updateGalleryDto.media !== undefined) gallery.media = updateGalleryDto.media;
    if (updateGalleryDto.images) {
      gallery.images = updateGalleryDto.images.map((img, index) => ({
        ...img,
        displayOrder: img.displayOrder ?? index,
      }));
    }
    if (updateGalleryDto.isVisible !== undefined) gallery.isVisible = updateGalleryDto.isVisible;

    return await this.galleryRepository.save(gallery);
  }

  async uploadMedia(
    id: string,
    file: Express.Multer.File,
    type?: MediaType,
  ): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException("Gallery not found");
    }

    const folderId = await this.fileStorageService.ensureGalleryFolder();
    const uploadResult = await this.fileStorageService.uploadFile(file, folderId);

    const mediaType = type || this.detectMediaType(file.mimetype);

    gallery.media = {
      fileId: uploadResult.id,
      fileKey: uploadResult.key,
      url: uploadResult.url,
      type: mediaType,
      fileName: uploadResult.fileName,
      mimeType: uploadResult.mimeType,
      size: uploadResult.size,
    };

    return await this.galleryRepository.save(gallery);
  }

  private detectMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith("video/")) {
      return MediaType.VIDEO;
    }
    return MediaType.PHOTO;
  }

  async remove(id: string) {
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException("Gallery not found");
    }

    if (gallery.media?.fileId) {
      await this.fileStorageService.deleteFile(gallery.media.fileId);
    }

    for (const image of gallery.images || []) {
      if (image.imageUrl) {
        const fileIdMatch = image.imageUrl.match(/\/([a-f0-9-]+)(\?|$)/i);
        if (fileIdMatch) {
          await this.fileStorageService.deleteFile(fileIdMatch[1]);
        }
      }
    }

    await this.galleryRepository.remove(gallery);
    return { message: "Gallery deleted successfully" };
  }

  async toggleVisibility(id: string): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException("Gallery not found");
    }

    gallery.isVisible = !gallery.isVisible;
    return await this.galleryRepository.save(gallery);
  }

  async uploadImages(
    id: string,
    images: { imageUrl: string; altText?: string; displayOrder?: number }[]
  ): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException("Gallery not found");
    }

    gallery.images = [...gallery.images, ...images.map((img, index) => ({
      ...img,
      displayOrder: img.displayOrder ?? (gallery.images.length + index),
    }))];
    return await this.galleryRepository.save(gallery);
  }

  async deleteImage(id: string, imageUrl: string): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({ where: { id } });
    if (!gallery) {
      throw new NotFoundException("Gallery not found");
    }

    gallery.images = gallery.images.filter(img => img.imageUrl !== imageUrl);
    return await this.galleryRepository.save(gallery);
  }

  async findAllAdmin(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [galleries, total] = await Promise.all([
      this.galleryRepository.find({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['creator'],
      }),
      this.galleryRepository.count(),
    ]);

    return {
      data: galleries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCategories(): Promise<string[]> {
    const result = await this.galleryRepository
      .createQueryBuilder("gallery")
      .select("DISTINCT gallery.category", "category")
      .where("gallery.category IS NOT NULL")
      .andWhere("gallery.category != ''")
      .getRawMany();
    
    return result.map(r => r.category).filter(Boolean);
  }

  async getGalleryFolderId(): Promise<string> {
    return this.fileStorageService.ensureGalleryFolder();
  }

  async uploadFileToStorage(
    file: Express.Multer.File,
    folderId: string,
  ): Promise<{ id: string; key: string; url?: string; fileName: string; mimeType: string; size: number }> {
    return this.fileStorageService.uploadFile(file, folderId);
  }
}
