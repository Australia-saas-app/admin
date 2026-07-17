import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { NoticeService } from "./notice.service";

@ApiTags("notices")
@Controller("notices")
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  @ApiOperation({
    summary: "Get all active notices (public access)",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getActiveNotices(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.noticeService.findAll(page, limit);
  }

  @Get("search/:name")
  @ApiOperation({ summary: "Search notices by title" })
  @ApiParam({ name: "name", description: "Search term" })
  async searchNotices(@Param("name") name: string) {
    return this.noticeService.search(name);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get specific notice details" })
  @ApiParam({ name: "id", description: "Notice ID" })
  async getNoticeDetails(@Param("id") id: string) {
    const notice = await this.noticeService.findOne(id);
    return {
      data: notice,
    };
  }
}
