import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FileManagementService } from './file-management.service';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { Request } from 'express';

@ApiTags('file-management')
@Controller('file-management')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FileManagementController {
  constructor(private readonly fileManagementService: FileManagementService) {}

  private getToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    return authHeader?.split(' ')[1];
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  async getFiles(@Req() req: Request) {
    return await this.fileManagementService.getFiles(this.getToken(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getFile(@Param('id') id: string, @Req() req: Request) {
    return await this.fileManagementService.getFileById(id, this.getToken(req));
  }

  @Get(':id/scan')
  @ApiOperation({ summary: 'Get file scan status' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'Scan status retrieved successfully' })
  async getScanStatus(@Param('id') id: string, @Req() req: Request) {
    return await this.fileManagementService.getScanStatus(id, this.getToken(req));
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve file (mark as clean)' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File approved successfully' })
  async approveFile(@Param('id') id: string, @Req() req: Request) {
    return await this.fileManagementService.approveFile(id, this.getToken(req));
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject file (mark as infected)' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File rejected successfully' })
  async rejectFile(@Param('id') id: string, @Req() req: Request) {
    return await this.fileManagementService.rejectFile(id, this.getToken(req));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Param('id') id: string, @Req() req: Request) {
    await this.fileManagementService.deleteFile(id, this.getToken(req));
    return { message: 'File deleted successfully' };
  }
}
