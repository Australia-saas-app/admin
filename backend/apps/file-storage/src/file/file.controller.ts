import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from './file.service';
import { FolderService } from './folder.service';
import { FileVersionService } from './file-version.service';
import { FileShareService } from './file-share.service';
import { ListFilesDto } from './dto/list-files.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { UseGuards } from '@nestjs/common';
import { SimpleAuthGuard } from '../common/auth.guard';

@ApiBearerAuth('JWT-auth')
@ApiTags('files')
@Controller()
@UseGuards(SimpleAuthGuard)
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly folderService: FolderService,
    private readonly versionService: FileVersionService,
    private readonly shareService: FileShareService,
  ) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('ownerId') ownerId?: string,
    @Body('folderId') folderId?: string,
    @Body('tags') tags?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Parse tags if provided as JSON string or comma-separated
    let tagsArray: string[] = [];
    if (tags) {
      try {
        tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch {
        // If not JSON, treat as comma-separated string
        tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    const dto: UploadFileDto = {
      ownerId,
      folderId,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    };

    return this.fileService.directUpload(file, dto);
  }

  @Post('presign/upload')
  createPresignedUpload(@Body() dto: PresignedUploadDto) {
    return this.fileService.createPresignedUpload(dto);
  }

  @Post(':id/upload')
  completePresignedUpload(@Param('id') id: string) {
    return this.fileService.completePresignedUpload(id);
  }

  @Get()
  list(@Query() query: ListFilesDto) {
    return this.fileService.list(query);
  }

  // Folder management
  @Post('folders')
  createFolder(
    @Body() body: { name: string; ownerId?: string; parentId?: string }
  ) {
    return this.folderService.create(body.name, body.ownerId, body.parentId);
  }

  @Get('folders')
  listFolders(@Query('ownerId') ownerId?: string) {
    return this.folderService.findAll(ownerId);
  }

  @Get('folders/:id')
  getFolder(@Param('id') id: string) {
    return this.folderService.findOne(id);
  }

  @Patch('folders/:id')
  updateFolder(@Param('id') id: string, @Body() body: { name: string }) {
    return this.folderService.update(id, body.name);
  }

  @Delete('folders/:id')
  deleteFolder(@Param('id') id: string) {
    return this.folderService.delete(id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.fileService.getOne(id);
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Query('expiresIn') expiresIn?: number) {
    const { file, downloadUrl } = await this.fileService.getDownloadUrl(id, expiresIn);

    return {
      id: file.id,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.size,
      downloadUrl,
    };
  }

  @Patch(':id/metadata')
  updateMetadata(
    @Param('id') id: string,
    @Body() body: { filename?: string; folderId?: string; tags?: string[] }
  ) {
    return this.fileService.updateMetadata(id, body);
  }

  @Delete(':id/soft')
  softDelete(@Param('id') id: string) {
    return this.fileService.softDelete(id);
  }

  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.fileService.restore(id);
  }

  @Get(':id/scan')
  getScanStatus(@Param('id') id: string) {
    return this.fileService.getScanStatus(id);
  }

  @Patch(':id/scan')
  updateScanStatus(
    @Param('id') id: string,
    @Body() body: { scanStatus: 'pending' | 'clean' | 'infected' | 'skipped' | 'error'; scanResult?: Record<string, any> }
  ) {
    return this.fileService.updateScanStatus(id, body.scanStatus, body.scanResult);
  }

  // Version management
  @Post(':id/versions')
  @UseInterceptors(FileInterceptor('file'))
  createVersion(
    @Param('id') fileId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('changeDescription') changeDescription?: string,
    @Body('createdBy') createdBy?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.versionService.createVersion(fileId, file, createdBy, changeDescription);
  }

  @Get(':id/versions')
  getVersions(@Param('id') fileId: string) {
    return this.versionService.getVersions(fileId);
  }

  @Get(':id/versions/:version/download')
  async downloadVersion(
    @Param('id') fileId: string,
    @Param('version') version: number,
    @Query('expiresIn') expiresIn?: number
  ) {
    const downloadUrl = await this.versionService.getDownloadUrl(fileId, parseInt(version.toString()), expiresIn);
    return { downloadUrl };
  }

  @Post(':id/versions/:version/rollback')
  rollbackToVersion(@Param('id') fileId: string, @Param('version') version: number) {
    return this.versionService.rollbackToVersion(fileId, parseInt(version.toString()));
  }

  // File sharing
  @Post(':id/shares')
  createShare(
    @Param('id') fileId: string,
    @Body() body: {
      expiresAt?: string;
      password?: string;
      permissions?: { view: boolean; download: boolean };
      maxAccesses?: number;
      createdBy?: string;
    }
  ) {
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;
    return this.shareService.createShare(
      fileId,
      body.createdBy,
      expiresAt,
      body.password,
      body.permissions,
      body.maxAccesses
    );
  }

  @Get(':id/shares')
  getShares(@Param('id') fileId: string) {
    return this.shareService.getShares(fileId);
  }

  @Delete('shares/:shareId')
  deleteShare(@Param('shareId') shareId: string) {
    return this.shareService.deleteShare(shareId);
  }

  @Patch('shares/:shareId')
  updateShare(
    @Param('shareId') shareId: string,
    @Body() body: Partial<{
      expiresAt: string;
      password: string;
      permissions: { view: boolean; download: boolean };
      maxAccesses: number;
      isActive: boolean;
    }>
  ) {
    const updates: any = { ...body };
    if (body.expiresAt) {
      updates.expiresAt = new Date(body.expiresAt);
    }
    return this.shareService.updateShare(shareId, updates);
  }

  // Public share access (no auth required)
  @Get('share/:token')
  async accessShare(
    @Param('token') token: string,
    @Query('password') password?: string
  ) {
    const { share, file } = await this.shareService.getShareByToken(token, password);
    return {
      share: {
        id: share.id,
        permissions: share.permissions,
        expiresAt: share.expiresAt,
      },
      file: {
        id: file.id,
        filename: file.filename,
        mimeType: file.mimeType,
        size: file.size,
      },
    };
  }

  @Get('share/:token/download')
  async downloadSharedFile(
    @Param('token') token: string,
    @Query('password') password?: string,
    @Query('expiresIn') expiresIn?: number
  ) {
    const { share, file } = await this.shareService.getShareByToken(token, password);

    if (!share.permissions.download) {
      throw new BadRequestException('Download not permitted for this share');
    }

    const { downloadUrl } = await this.fileService.getDownloadUrl(file.id, expiresIn);
    return { downloadUrl };
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.fileService.hardDelete(id);
  }
}
