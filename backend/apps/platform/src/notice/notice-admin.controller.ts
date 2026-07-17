import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
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
  ApiQuery,
  ApiConsumes,
} from "@nestjs/swagger";
import { NoticeService } from "./notice.service";
import { NoticeFileStorageService } from "./notice-file-storage.service";
import { PlatformAuthGuard } from "../common/guards/platform-auth.guard";
import { CreateNoticeDto, UpdateNoticeDto } from "./dto/notice.dto";
import { NoticePriority } from "../entities/notice.entity";
import { Request } from "express";

@ApiTags("admin-notices")
@Controller("admin/notices")
@UseGuards(PlatformAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AdminNoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly noticeFileStorageService: NoticeFileStorageService,
  ) {}

  private getAdminId(req: Request): string | undefined {
    return (req as any).admin?.adminId;
  }

  @Post()
  @ApiOperation({ summary: "Create a new notice" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async createNotice(
    @Body() createNoticeDto: CreateNoticeDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    let fileData = createNoticeDto.file;

    if (file) {
      const folderId = await this.noticeService.getNoticeFolderId();
      const uploadResult = await this.noticeService.uploadFileToStorage(file, folderId);
      const fileType = this.detectFileType(file.mimetype);

      fileData = {
        fileId: uploadResult.id,
        fileKey: uploadResult.key,
        url: uploadResult.url,
        fileName: uploadResult.fileName,
        mimeType: uploadResult.mimeType,
        size: String(uploadResult.size),
        type: fileType,
      };
    }

    const notice = await this.noticeService.create({
      title: createNoticeDto.title,
      description: createNoticeDto.description,
      file: fileData ? {
        fileId: fileData.fileId,
        fileKey: fileData.fileKey,
        url: fileData.url,
        fileName: fileData.fileName,
        mimeType: fileData.mimeType,
        size: fileData.size ? parseInt(fileData.size as any) : undefined,
        type: fileData.type,
      } : undefined,
      priority: createNoticeDto.priority,
      isVisible: createNoticeDto.isVisible === 'true' ? true : createNoticeDto.isVisible === 'false' ? false : undefined,
      createdBy: this.getAdminId(req),
    });
    return {
      message: "Notice created successfully",
      data: notice,
    };
  }

  private detectFileType(mimeType: string): 'photo' | 'pdf' {
    if (mimeType === 'application/pdf') {
      return 'pdf';
    }
    return 'photo';
  }

  @Get()
  @ApiOperation({ summary: "Get all notices (admin)" })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'priority', required: false, type: String })
  async getAllNotices(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('priority') priority?: string,
  ) {
    return await this.noticeService.findAllAdmin(
      Number(page) || 1,
      Number(limit) || 20,
      { priority }
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get notice by ID" })
  @ApiParam({ name: "id", description: "Notice ID" })
  @ApiBearerAuth()
  async getNotice(@Param("id") id: string) {
    const notice = await this.noticeService.findOne(id);
    return {
      data: notice,
    };
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update notice details" })
  @ApiParam({ name: "id", description: "Notice ID" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async updateNotice(
    @Param("id") id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let fileData = updateNoticeDto.file;

    if (file) {
      const folderId = await this.noticeService.getNoticeFolderId();
      const uploadResult = await this.noticeService.uploadFileToStorage(file, folderId);
      const fileType = this.detectFileType(file.mimetype);

      fileData = {
        fileId: uploadResult.id,
        fileKey: uploadResult.key,
        url: uploadResult.url,
        fileName: uploadResult.fileName,
        mimeType: uploadResult.mimeType,
        size: String(uploadResult.size),
        type: fileType,
      };
    }

    const notice = await this.noticeService.update(id, {
      title: updateNoticeDto.title,
      description: updateNoticeDto.description,
      file: fileData ? {
        fileId: fileData.fileId,
        fileKey: fileData.fileKey,
        url: fileData.url,
        fileName: fileData.fileName,
        mimeType: fileData.mimeType,
        size: fileData.size ? parseInt(fileData.size as any) : undefined,
        type: fileData.type,
      } : undefined,
      priority: updateNoticeDto.priority,
      isVisible: updateNoticeDto.isVisible === 'true' ? true : updateNoticeDto.isVisible === 'false' ? false : undefined,
    });
    return {
      message: "Notice updated successfully",
      data: notice,
    };
  }

  @Post(":id/file")
  @ApiOperation({ summary: "Upload file (photo or PDF) to notice" })
  @ApiParam({ name: "id", description: "Notice ID" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    const notice = await this.noticeService.uploadFile(id, file);
    return {
      message: "File uploaded successfully",
      data: notice,
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete notice" })
  @ApiParam({ name: "id", description: "Notice ID" })
  @ApiBearerAuth()
  async deleteNotice(@Param("id") id: string) {
    await this.noticeService.remove(id);
    return {
      message: "Notice deleted successfully",
    };
  }

  @Patch(":id/visibility")
  @ApiOperation({ summary: "Toggle notice visibility" })
  @ApiParam({ name: "id", description: "Notice ID" })
  @ApiBearerAuth()
  async toggleNoticeVisibility(@Param("id") id: string) {
    const notice = await this.noticeService.toggleVisibility(id);
    return {
      message: "Notice visibility toggled successfully",
      data: notice,
    };
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Mark notice as read" })
  @ApiParam({ name: "id", description: "Notice ID" })
  @ApiBearerAuth()
  async markAsRead(@Param("id") id: string) {
    const notice = await this.noticeService.markAsRead(id);
    return {
      message: "Notice marked as read",
      data: notice,
    };
  }
}
