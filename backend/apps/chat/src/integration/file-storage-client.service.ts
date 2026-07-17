import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

@Injectable()
export class FileStorageClientService {
  private readonly logger = new Logger(FileStorageClientService.name);
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('FILE_STORAGE_SERVICE_URL', 'http://localhost:3009/api/files');
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 120000, // 2 minutes for file uploads
    });
  }

  async uploadFile(file: Express.Multer.File, token: string, folderId?: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      if (folderId) {
        formData.append('folderId', folderId);
      }

      const response = await this.client.post('/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders(),
        },
      });
      // The file-storage service now returns a presigned URL directly in the upload response
      if (response.data?.url) return response.data.url;

      // Fallback for older implementations
      const id = response.data?.id;
      if (id) {
        // Build a download URL using the file-storage base URL
        const base = this.baseUrl.replace(/\/+$/, '');
        return `${base}/${id}/download`;
      }
      const key = response.data?.key;
      if (key) {
        const base = this.baseUrl.replace(/\/+$/, '');
        // If service exposes direct download by key, use download route by id is preferred,
        // but as a fallback expose a files/by-key route if available. Use `/api/files/${key}` as fallback.
        return `${base}/${encodeURIComponent(key)}/download`;
      }

      return null;
    } catch (error) {
      this.logger.error(`File upload failed: ${error.message}`, {
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        stack: error.stack
      });

      // Extract error message from file-storage service response
      if (error.response?.data?.message) {
        throw new BadRequestException(error.response.data.message);
      }

      throw error;
    }
  }
}

