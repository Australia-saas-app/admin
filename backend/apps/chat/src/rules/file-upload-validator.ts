import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadValidator {
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(private readonly configService: ConfigService) {
    this.maxFileSize = Number(
      this.configService.get('MAX_FILE_SIZE', 1048576) // 1MB default
    );
    
    const allowedTypes = this.configService.get('ALLOWED_FILE_TYPES', 'pdf,image/*,audio/*,video/*');
    this.allowedMimeTypes = allowedTypes.split(',').map(t => t.trim());
  }

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize} bytes`
      );
    }

    const isAllowed = this.allowedMimeTypes.some(allowedType => {
      if (allowedType.endsWith('/*')) {
        const baseType = allowedType.split('/')[0];
        return file.mimetype.startsWith(`${baseType}/`);
      }
      return file.mimetype === allowedType;
    });

    if (!isAllowed) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }
  }
}

