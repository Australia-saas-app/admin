import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { GalleryService } from "./gallery.service";

@ApiTags("gallery")
@Controller("gallery")
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @ApiOperation({
    summary: "Get all gallery categories with images (public access)",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getGalleryCategories(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.galleryService.findAll(Number(page), Number(limit));
  }

  @Get("search/:name")
  @ApiOperation({ summary: "Search gallery by title" })
  @ApiParam({ name: "name", description: "Search term" })
  async searchGallery(@Param("name") name: string) {
    return this.galleryService.search(name);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get specific gallery category with all images" })
  @ApiParam({ name: "id", description: "Gallery category ID" })
  async getGalleryCategoryDetails(@Param("id") id: string) {
    const gallery = await this.galleryService.findOne(id);
    return {
      data: gallery,
    };
  }
}
