import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Req,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from "@nestjs/swagger";
import { GalleryService } from "../gallery/gallery.service";
import { PlatformAuthGuard } from "../common/guards/platform-auth.guard";
import { CreateGalleryDto, UpdateGalleryDto, UploadMediaDto } from "../gallery/dto/gallery.dto";
import { MediaType } from "../entities/gallery.entity";

@ApiTags("admin-gallery")
@Controller("admin/gallery")
@UseGuards(PlatformAuthGuard)
export class AdminGalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  private getAdminId(req: Request): string | undefined {
    return (req as any).admin?.adminId;
  }

  @Get()
  @ApiOperation({ summary: "Get all gallery items (admin - includes hidden)" })
  @ApiBearerAuth()
  async getAllGalleries(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.galleryService.findAllAdmin(Number(page), Number(limit));
  }

  @Get("categories")
  @ApiOperation({ summary: "Get all existing categories" })
  @ApiBearerAuth()
  async getCategories() {
    const categories = await this.galleryService.getCategories();
    return { data: categories };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a gallery item" })
  @ApiParam({ name: "id", description: "Gallery ID" })
  @ApiBearerAuth()
  async deleteGallery(@Param("id") id: string) {
    return await this.galleryService.remove(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new gallery item" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async createGallery(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() file: Express.Multer.File,
    @Body("type") mediaType: "photo" | "video",
    @Req() req: Request,
  ) {
    let media = createGalleryDto.media;

    if (file) {
      const folderId = await this.galleryService.getGalleryFolderId();
      const uploadResult = await this.galleryService.uploadFileToStorage(file, folderId);
      const detectedType = mediaType || this.detectMediaType(file.mimetype);
      
      media = {
        fileId: uploadResult.id,
        fileKey: uploadResult.key,
        url: uploadResult.url,
        type: detectedType as MediaType,
        fileName: uploadResult.fileName,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
      };
    }

    const gallery = await this.galleryService.create({
      ...createGalleryDto,
      media,
      createdBy: this.getAdminId(req),
    });
    return {
      message: "Gallery item created successfully",
      data: gallery,
    };
  }

  private detectMediaType(mimeType: string): string {
    return mimeType.startsWith("video/") ? "video" : "photo";
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update gallery item details" })
  @ApiParam({ name: "id", description: "Gallery ID" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async updateGallery(
    @Param("id") id: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFile() file: Express.Multer.File,
    @Body("type") mediaType: "photo" | "video",
  ) {
    let media = updateGalleryDto.media;

    if (file) {
      const folderId = await this.galleryService.getGalleryFolderId();
      const uploadResult = await this.galleryService.uploadFileToStorage(file, folderId);
      const detectedType = mediaType || this.detectMediaType(file.mimetype);
      
      media = {
        fileId: uploadResult.id,
        fileKey: uploadResult.key,
        url: uploadResult.url,
        type: detectedType as MediaType,
        fileName: uploadResult.fileName,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
      };
    }

    const gallery = await this.galleryService.update(id, {
      ...updateGalleryDto,
      media,
    });
    return {
      message: "Gallery item updated successfully",
      data: gallery,
    };
  }

  @Post(":id/media")
  @ApiOperation({ summary: "Upload media (photo/video) to gallery item" })
  @ApiParam({ name: "id", description: "Gallery ID" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async uploadMedia(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadMediaDto,
  ) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    const mediaType = body.type === "video" ? MediaType.VIDEO : body.type === "photo" ? MediaType.PHOTO : undefined;
    const gallery = await this.galleryService.uploadMedia(id, file, mediaType);
    return {
      message: "Media uploaded successfully",
      data: gallery,
    };
  }

  @Post(":id/images")
  @ApiOperation({ summary: "Add images to a gallery item" })
  @ApiParam({ name: "id", description: "Gallery ID" })
  @ApiBearerAuth()
  async addImagesToGallery(
    @Param("id") id: string,
    @Body()
    body: {
      images: Array<{
        imageUrl: string;
        altText?: string;
        displayOrder?: number;
      }>;
    },
  ) {
    const gallery = await this.galleryService.uploadImages(id, body.images);
    return {
      message: "Images added successfully",
      data: gallery,
    };
  }

  @Delete(":id/images/:imageIndex")
  @ApiOperation({ summary: "Delete a specific image from gallery" })
  @ApiParam({ name: "id", description: "Gallery ID" })
  @ApiParam({ name: "imageIndex", description: "Image index to delete" })
  @ApiBearerAuth()
  async deleteGalleryImage(
    @Param("id") id: string,
    @Param("imageIndex") imageIndex: string,
  ) {
    const galleryIndex = parseInt(imageIndex);
    if (isNaN(galleryIndex)) {
      throw new BadRequestException("Invalid image index");
    }
    
    const gallery = await this.galleryService.findOne(id);
    if (!gallery) {
      throw new NotFoundException("Gallery not found");
    }
    
    if (galleryIndex < 0 || galleryIndex >= gallery.images.length) {
      throw new BadRequestException("Image index out of range");
    }
    
    const imageUrl = gallery.images[galleryIndex].imageUrl;
    const updatedGallery = await this.galleryService.deleteImage(id, imageUrl);
    return {
      message: "Image deleted successfully",
      data: updatedGallery,
    };
  }

  @Patch(":id/visibility")
  @ApiOperation({ summary: "Toggle gallery item visibility" })
  @ApiParam({ name: "id", description: "Gallery ID" })
  @ApiBearerAuth()
  async toggleGalleryVisibility(@Param("id") id: string) {
    const gallery = await this.galleryService.toggleVisibility(id);
    return {
      message: "Gallery visibility toggled successfully",
      data: gallery,
    };
  }
}
