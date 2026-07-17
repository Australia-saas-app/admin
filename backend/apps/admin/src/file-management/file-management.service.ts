import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FileManagementService {
  private readonly logger = new Logger(FileManagementService.name);
  private readonly fileStorageUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.fileStorageUrl = this.configService.get<string>(
      'FILE_STORAGE_SERVICE_URL',
      'http://localhost:3009/api/files',
    );
  }

  private getHeaders(adminToken?: string) {
    return {
      'Content-Type': 'application/json',
      ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
    };
  }

  async getFiles(adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.fileStorageUrl}/`, {
          headers: this.getHeaders(adminToken),
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch files: ${error.message}`);
      throw new BadRequestException('Failed to fetch files');
    }
  }

  async getFileById(id: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.fileStorageUrl}/${id}`, {
          headers: this.getHeaders(adminToken),
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`File ${id} not found`);
      }
      this.logger.error(`Failed to fetch file: ${error.message}`);
      throw new BadRequestException('Failed to fetch file');
    }
  }

  async approveFile(id: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${this.fileStorageUrl}/${id}/scan`,
          { scanStatus: 'clean' },
          { headers: this.getHeaders(adminToken) },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`File ${id} not found`);
      }
      this.logger.error(`Failed to approve file: ${error.message}`);
      throw new BadRequestException('Failed to approve file');
    }
  }

  async rejectFile(id: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${this.fileStorageUrl}/${id}/scan`,
          { scanStatus: 'infected' },
          { headers: this.getHeaders(adminToken) },
        ),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`File ${id} not found`);
      }
      this.logger.error(`Failed to reject file: ${error.message}`);
      throw new BadRequestException('Failed to reject file');
    }
  }

  async deleteFile(id: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.delete(`${this.fileStorageUrl}/${id}`, {
          headers: this.getHeaders(adminToken),
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`File ${id} not found`);
      }
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async getScanStatus(id: string, adminToken?: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.fileStorageUrl}/${id}/scan`, {
          headers: this.getHeaders(adminToken),
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`File ${id} not found`);
      }
      this.logger.error(`Failed to get scan status: ${error.message}`);
      throw new BadRequestException('Failed to get scan status');
    }
  }
}
