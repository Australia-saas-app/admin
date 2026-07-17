import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileValidationService {
  private readonly allowedMimeTypes: Set<string>;
  private readonly allowedExtensions: Set<string>;
  private readonly maxFileSize: number;
  private readonly enableAntivirusScan: boolean;

  // Magic bytes (file signatures) for common file types
  private readonly magicBytes: Map<string, Buffer[]> = new Map([
    // Images
    ['image/jpeg', [Buffer.from([0xff, 0xd8, 0xff])]],
    ['image/png', [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])]],
    ['image/gif', [Buffer.from([0x47, 0x49, 0x46, 0x38])]],
    ['image/webp', [Buffer.from([0x52, 0x49, 0x46, 0x46])]],
    ['image/svg+xml', [Buffer.from('<svg', 'utf8'), Buffer.from('<?xml', 'utf8')]],
    // Documents
    ['application/pdf', [Buffer.from([0x25, 0x50, 0x44, 0x46])]], // %PDF
    ['application/msword', [Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])]], // DOC
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', [Buffer.from('PK', 'utf8')]], // DOCX
    ['application/vnd.ms-excel', [Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])]], // XLS
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', [Buffer.from('PK', 'utf8')]], // XLSX
    ['application/vnd.ms-powerpoint', [Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])]], // PPT
    ['application/vnd.openxmlformats-officedocument.presentationml.presentation', [Buffer.from('PK', 'utf8')]], // PPTX
    // Text
    ['text/plain', []], // No magic bytes, validate by extension
    ['text/csv', []],
    ['text/html', [Buffer.from('<!DOCTYPE', 'utf8'), Buffer.from('<html', 'utf8')]],
    // Archives
    ['application/zip', [Buffer.from([0x50, 0x4b, 0x03, 0x04])]], // ZIP
    ['application/x-rar-compressed', [Buffer.from([0x52, 0x61, 0x72, 0x21])]], // RAR
    ['application/x-7z-compressed', [Buffer.from([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c])]], // 7Z
    // Audio
    ['audio/mpeg', [Buffer.from([0xff, 0xfb]), Buffer.from([0xff, 0xf3]), Buffer.from([0xff, 0xf2])]], // MP3
    ['audio/wav', [Buffer.from('RIFF', 'utf8')]],
    ['audio/ogg', [Buffer.from('OggS', 'utf8')]],
    ['audio/mp4', [Buffer.from([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70])]], // M4A
    // Video
    ['video/mp4', [Buffer.from([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70])]],
    ['video/quicktime', [Buffer.from([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70])]], // MOV
    ['video/x-msvideo', [Buffer.from('RIFF', 'utf8')]], // AVI
    ['video/webm', [Buffer.from([0x1a, 0x45, 0xdf, 0xa3])]],
  ]);

  constructor(private readonly config: ConfigService) {
    // Load allowed MIME types from config or use defaults
    const allowedTypes = this.config.get<string>('ALLOWED_MIME_TYPES');
    if (allowedTypes) {
      this.allowedMimeTypes = new Set(allowedTypes.split(',').map((t) => t.trim()));
    } else {
      // Default allowed types based on document requirements
      this.allowedMimeTypes = new Set([
        // Images
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        // Documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
        'text/plain',
        'text/csv',
        'text/html',
        // Archives
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        // Audio
        'audio/mpeg',
        'audio/wav',
        'audio/wave',
        'audio/ogg',
        'audio/mp4',
        'audio/x-m4a',
        'audio/webm',
        'audio/x-aiff',
        'audio/flac',
        // Video
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm',
        'video/x-matroska',
        'video/x-flv',
        'video/3gpp',
      ]);
    }

    // Load allowed extensions
    const allowedExts = this.config.get<string>('ALLOWED_FILE_EXTENSIONS');
    if (allowedExts) {
      this.allowedExtensions = new Set(allowedExts.split(',').map((e) => e.trim().toLowerCase()));
    } else {
      this.allowedExtensions = new Set([
        // Images
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico',
        // Documents
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'html', 'rtf', 'odt', 'ods', 'odp',
        // Archives
        'zip', 'rar', '7z', 'tar', 'gz', 'bz2',
        // Audio
        'mp3', 'wav', 'ogg', 'm4a', 'webm', 'flac', 'aiff', 'aif',
        // Video
        'mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', '3gp', 'wmv', 'mpeg',
      ]);
    }

    this.maxFileSize = Number(this.config.get('MAX_UPLOAD_BYTES') ?? 10 * 1024 * 1024);
    this.enableAntivirusScan = this.config.get<string>('ENABLE_ANTIVIRUS_SCAN', 'true').toLowerCase() === 'true';
  }

  /**
   * Validate file type, size, and security
   */
  async validateFile(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Skip all validation if JWT verification disabled
    const skipVerification = this.config.get<string>('SKIP_JWT_VERIFICATION', 'false').toLowerCase() === 'true';
    if (skipVerification) {
      return;
    }

    // 1. Size validation
    this.validateFileSize(file.size);

    // 2. Extension validation
    this.validateExtension(file.originalname);

    // 3. MIME type validation
    this.validateMimeType(file.mimetype);

    // 4. Magic bytes validation (file signature)
    await this.validateMagicBytes(file.buffer, file.mimetype, file.originalname);

    // 5. Filename security check
    this.validateFilename(file.originalname);

    // 6. Basic antivirus scan (file content analysis)
    if (this.enableAntivirusScan) {
      await this.performAntivirusScan(file.buffer, file.originalname);
    }
  }

  /**
   * Validate file size
   */
  private validateFileSize(size: number): void {
    if (size <= 0) {
      throw new BadRequestException('File size must be greater than 0');
    }
    if (size > this.maxFileSize) {
      const maxSizeMB = (this.maxFileSize / (1024 * 1024)).toFixed(2);
      throw new BadRequestException(`File size exceeds maximum allowed size of ${maxSizeMB}MB`);
    }
  }

  /**
   * Validate file extension
   */
  private validateExtension(filename: string): void {
    const ext = this.getExtension(filename);
    if (!ext || !this.allowedExtensions.has(ext.toLowerCase())) {
      throw new BadRequestException(
        `File extension .${ext} is not allowed. Allowed extensions: ${Array.from(this.allowedExtensions).join(', ')}`,
      );
    }
  }

  /**
   * Validate MIME type
   */
  validateMimeType(mimeType: string): void {
    // Normalize MIME type (handle case variations)
    const normalized = mimeType.toLowerCase().trim();

    // Check if exact match
    if (this.allowedMimeTypes.has(normalized)) {
      return;
    }

    // Check if base type matches (e.g., image/*)
    const [type, subtype] = normalized.split('/');
    if (subtype && this.allowedMimeTypes.has(`${type}/*`)) {
      return;
    }

    throw new BadRequestException(
      `MIME type ${mimeType} is not allowed. Allowed types: ${Array.from(this.allowedMimeTypes).join(', ')}`,
    );
  }

  /**
   * Validate magic bytes (file signature) to prevent file type spoofing
   */
  private async validateMagicBytes(buffer: Buffer, mimeType: string, filename: string): Promise<void> {
    if (buffer.length < 8) {
      throw new BadRequestException('File is too small to validate');
    }

    const fileHeader = buffer.slice(0, Math.min(32, buffer.length));
    const expectedSignatures = this.magicBytes.get(mimeType.toLowerCase());

    // If no magic bytes defined for this type, skip validation (e.g., text files)
    if (!expectedSignatures || expectedSignatures.length === 0) {
      return;
    }

    // Check if file header matches any expected signature
    const matches = expectedSignatures.some((signature) => {
      if (fileHeader.length < signature.length) {
        return false;
      }
      return fileHeader.slice(0, signature.length).equals(signature);
    });

    if (!matches) {
      // Try to detect actual file type
      const detectedType = this.detectFileType(fileHeader);
      throw new BadRequestException(
        `File type mismatch. Declared MIME type: ${mimeType}, but file signature indicates: ${detectedType || 'unknown type'}. This may indicate file type spoofing.`,
      );
    }
  }

  /**
   * Detect file type from magic bytes
   */
  private detectFileType(buffer: Buffer): string | null {
    for (const [mimeType, signatures] of this.magicBytes.entries()) {
      for (const signature of signatures) {
        if (buffer.length >= signature.length && buffer.slice(0, signature.length).equals(signature)) {
          return mimeType;
        }
      }
    }
    return null;
  }

  /**
   * Validate filename for security (prevent path traversal, null bytes, etc.)
   */
  private validateFilename(filename: string): void {
    if (!filename || filename.trim().length === 0) {
      throw new BadRequestException('Filename is required');
    }

    // Check for path traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new BadRequestException('Filename contains invalid characters');
    }

    // Check for null bytes
    if (filename.includes('\0')) {
      throw new BadRequestException('Filename contains invalid characters');
    }

    // Check filename length
    if (filename.length > 255) {
      throw new BadRequestException('Filename is too long (max 255 characters)');
    }

    // Check for dangerous characters
    const dangerousChars = /[<>:"|?*\x00-\x1f]/;
    if (dangerousChars.test(filename)) {
      throw new BadRequestException('Filename contains invalid or dangerous characters');
    }
  }

  /**
   * Perform basic antivirus scan (content analysis)
   * In production, this should integrate with ClamAV or similar
   */
  private async performAntivirusScan(buffer: Buffer, filename: string): Promise<void> {
    // Basic checks for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onload=/i,
      /eval\(/i,
      /exec\(/i,
      /system\(/i,
    ];

    // Convert buffer to string for text-based files
    if (buffer.length < 1024 * 1024) {
      // Only scan small files as text
      try {
        const content = buffer.toString('utf8', 0, Math.min(10000, buffer.length));
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(content)) {
            throw new BadRequestException(
              `File contains potentially malicious content. Antivirus scan detected suspicious patterns.`,
            );
          }
        }
      } catch (error) {
        // If conversion fails, it's likely binary - that's okay
        if (error instanceof BadRequestException) {
          throw error;
        }
      }
    }

    // Check for executable signatures
    const executableSignatures = [
      Buffer.from([0x4d, 0x5a]), // MZ (Windows PE)
      Buffer.from([0x7f, 0x45, 0x4c, 0x46]), // ELF (Linux)
      Buffer.from([0xca, 0xfe, 0xba, 0xbe]), // Java class file
    ];

    for (const sig of executableSignatures) {
      if (buffer.length >= sig.length && buffer.slice(0, sig.length).equals(sig)) {
        throw new BadRequestException('Executable files are not allowed for security reasons');
      }
    }

    // Note: For production, integrate with ClamAV daemon:
    // const ClamScan = require('clamscan');
    // const clamscan = await new ClamScan().init();
    // const { isInfected, viruses } = await clamscan.isInfected(buffer);
    // if (isInfected) {
    //   throw new BadRequestException(`File is infected: ${viruses.join(', ')}`);
    // }
  }

  /**
   * Get file extension from filename
   */
  private getExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }


  /**
   * Get allowed MIME types
   */
  getAllowedMimeTypes(): string[] {
    return Array.from(this.allowedMimeTypes);
  }

  /**
   * Get allowed file extensions
   */
  getAllowedExtensions(): string[] {
    return Array.from(this.allowedExtensions);
  }

  /**
   * Validate filename (public method)
   */
  validateFilenamePublic(filename: string): void {
    this.validateFilename(filename);
  }
}

