import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { BlogService } from "./blog.service";

@ApiTags("blogs")
@Controller("blogs")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({
    summary: "Get all published blog posts",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getPublishedBlogs(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.blogService.findAll(page, limit);
  }

  @Get("categories")
  @ApiOperation({ summary: "Get available blog categories" })
  async getBlogCategories() {
    const categories = await this.blogService.findCategories();
    return {
      data: categories,
    };
  }

  @Get("search/:name")
  @ApiOperation({ summary: "Search blogs by title" })
  @ApiParam({ name: "name", description: "Search term" })
  async searchBlogs(@Param("name") name: string) {
    return this.blogService.search(name);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get specific blog post details" })
  @ApiParam({ name: "id", description: "Blog post ID" })
  async getBlogDetails(@Param("id") id: string) {
    const blog = await this.blogService.findOne(id);
    return {
      data: blog,
    };
  }
}
