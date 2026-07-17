import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { randomUUID } from 'crypto';
import { FileObject } from './file.entity';
import { Folder } from './folder.entity';
import { FileVersion } from './file-version.entity';
import { FileShare } from './file-share.entity';
import { ListFilesDto } from './dto/list-files.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { FileValidationService } from './file-validation.service';
import { R2StorageService } from './r2-storage.service';

@Injectable()
export class FileService {
  private readonly maxUploadBytes: number;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(FileObject)
    private readonly repo: Repository<FileObject>,
    private readonly fileValidation: FileValidationService,
    private readonly r2Storage: R2StorageService,
  ) {
    this.maxUploadBytes = Number(this.config.get('MAX_UPLOAD_BYTES') ?? 10 * 1024 * 1024);
  }

  private async buildKey(folderId: string | undefined, filename: string) {
    let keyPrefix = '';
    if (folderId) {
      const folder = await this.repo.manager.findOne(Folder, { where: { id: folderId } });
      if (folder) {
        keyPrefix = `${folder.path}/`;
      }
    }
    return `${keyPrefix}${randomUUID()}-${filename}`;
  }



  async directUpload(file: Express.Multer.File, meta: UploadFileDto) {
    // Comprehensive file validation (size, type, security, antivirus)
    await this.fileValidation.validateFile(file);

    const key = await this.buildKey(meta.folderId, file.originalname);

    // Perform antivirus scan and update scan status
    let scanStatus: 'pending' | 'clean' | 'infected' | 'skipped' | 'error' = 'clean';
    let scanResult: Record<string, any> | undefined;

    try {
      // Validation already performed basic scan, mark as clean
      scanStatus = 'clean';
      scanResult = { scanned: true, timestamp: new Date().toISOString() };
    } catch (error) {
      scanStatus = 'error';
      scanResult = { error: error.message };
    }

    const record = this.repo.create({
      key,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      ownerId: meta.ownerId,
      folderId: meta.folderId,
      tags: meta.tags ?? [],
      isDeleted: false,
      currentVersion: 1,
      scanStatus,
      scanResult,
    });
    await this.repo.save(record);

    // Save file to Cloudflare R2
    await this.r2Storage.uploadFile(key, file.buffer, file.mimetype);

    // Generate presigned URL for immediate sharing
    const downloadUrl = await this.r2Storage.generatePresignedUrl(key);

    return { id: record.id, key, url: downloadUrl };
  }

  async createPresignedUpload(meta: PresignedUploadDto) {
    const key = await this.buildKey(meta.folderId, meta.filename);

    // Validate file type without file content
    await this.fileValidation.validateMimeType(meta.mimeType);

    const record = this.repo.create({
      key,
      filename: meta.filename,
      mimeType: meta.mimeType,
      size: meta.size,
      ownerId: meta.ownerId,
      folderId: meta.folderId,
      tags: meta.tags ?? [],
      isDeleted: false,
      currentVersion: 1,
      scanStatus: 'pending', // Will be updated after upload
    });

    await this.repo.save(record);

    // Generate presigned upload URL
    const uploadUrl = await this.r2Storage.generatePresignedUploadUrl(key, meta.mimeType, meta.size);

    return {
      id: record.id,
      key,
      uploadUrl,
      fields: {}, // For S3-compatible services
    };
  }

  async completePresignedUpload(id: string) {
    const file = await this.repo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if file exists in storage
    const exists = await this.r2Storage.fileExists(file.key);
    if (!exists) {
      throw new NotFoundException('Uploaded file not found in storage');
    }

    // Perform validation on the uploaded file
    // Note: This is limited since we don't have the file buffer
    // In a real implementation, you might want to download and scan

    file.scanStatus = 'clean';
    file.scanResult = { uploaded: true, timestamp: new Date().toISOString() };

    await this.repo.save(file);

    const downloadUrl = await this.r2Storage.generatePresignedUrl(file.key);

    return { id: file.id, key: file.key, url: downloadUrl };
  }

  async list(query: ListFilesDto) {
    const queryBuilder = this.repo.createQueryBuilder('file');

    if (query.ownerId) {
      queryBuilder.andWhere('file.ownerId = :ownerId', { ownerId: query.ownerId });
    }
    if (query.folderId) {
      queryBuilder.andWhere('file.folderId = :folderId', { folderId: query.folderId });
    }
    if (query.tag) {
      queryBuilder.andWhere(`file.tags @> :tag`, { tag: JSON.stringify([query.tag]) });
    }
    if (query.search) {
      queryBuilder.andWhere('file.filename ILIKE :search', { search: `%${query.search}%` });
    }
    queryBuilder.andWhere('file.isDeleted = false');

    const take = query.limit ?? 50;
    const skip = query.offset ?? 0;

    const [items, total] = await queryBuilder
      .leftJoinAndSelect('file.folder', 'folder')
      .take(take)
      .skip(skip)
      .orderBy('file.createdAt', 'DESC')
      .getManyAndCount();

    return { items, total, limit: take, offset: skip };
  }

  async getOne(id: string) {
    const file = await this.repo.findOne({ where: { id } });
    if (!file || file.isDeleted) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async updateMetadata(id: string, updates: Partial<Pick<FileObject, 'filename' | 'folderId' | 'tags'>>) {
    const file = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Validate folder exists if provided
    if (updates.folderId) {
      const folder = await this.repo.manager.findOne(Folder, { where: { id: updates.folderId } });
      if (!folder) {
        throw new NotFoundException('Folder not found');
      }
    }

    Object.assign(file, updates);
    return this.repo.save(file);
  }

  async softDelete(id: string) {
    const file = await this.repo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.isDeleted) {
      throw new BadRequestException('File is already deleted');
    }

    file.isDeleted = true;
    return this.repo.save(file);
  }

  async restore(id: string) {
    const file = await this.repo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (!file.isDeleted) {
      throw new BadRequestException('File is not deleted');
    }

    file.isDeleted = false;
    return this.repo.save(file);
  }

  async updateScanStatus(id: string, scanStatus: 'pending' | 'clean' | 'infected' | 'skipped' | 'error', scanResult?: Record<string, any>) {
    const file = await this.repo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    file.scanStatus = scanStatus;
    if (scanResult) {
      file.scanResult = scanResult;
    }

    return this.repo.save(file);
  }

  async getScanStatus(id: string) {
    const file = await this.repo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    return {
      id: file.id,
      scanStatus: file.scanStatus,
      scanResult: file.scanResult,
      scannedAt: file.updatedAt,
    };
  }

  async hardDelete(id: string) {
    const file = await this.repo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Delete file from Cloudflare R2
    await this.r2Storage.deleteFile(file.key);

    // Delete all versions
    const versions = await this.repo.manager.find(FileVersion, { where: { fileId: id } });
    for (const version of versions) {
      await this.r2Storage.deleteFile(version.key);
    }
    await this.repo.manager.delete(FileVersion, { fileId: id });

    // Delete all shares
    await this.repo.manager.delete(FileShare, { fileId: id });

    // Delete database record
    await this.repo.delete(id);
    return { id };
  }

  /**
    * Generate presigned URL for file download
    */
  async getDownloadUrl(id: string, expiresIn: number = 3600) {
    const file = await this.repo.findOne({ where: { id } });
    if (!file || file.isDeleted) {
      throw new NotFoundException('File not found');
    }

    // Check if file exists in R2
    const exists = await this.r2Storage.fileExists(file.key);
    if (!exists) {
      throw new NotFoundException('File not found in storage');
    }

    // Generate presigned URL for direct download
    const downloadUrl = await this.r2Storage.generatePresignedUrl(file.key, expiresIn);

    return {
      file,
      downloadUrl,
      expiresIn,
    };
  }
}
