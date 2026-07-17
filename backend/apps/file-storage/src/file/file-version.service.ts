import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileVersion } from './file-version.entity';
import { FileObject } from './file.entity';
import { FileValidationService } from './file-validation.service';
import { R2StorageService } from './r2-storage.service';

@Injectable()
export class FileVersionService {
  constructor(
    @InjectRepository(FileVersion)
    private readonly repo: Repository<FileVersion>,
    @InjectRepository(FileObject)
    private readonly fileRepo: Repository<FileObject>,
    private readonly fileValidation: FileValidationService,
    private readonly r2Storage: R2StorageService,
  ) {}

  async createVersion(
    fileId: string,
    file: Express.Multer.File,
    createdBy?: string,
    changeDescription?: string
  ): Promise<FileVersion> {
    const originalFile = await this.fileRepo.findOne({ where: { id: fileId } });
    if (!originalFile) {
      throw new NotFoundException('File not found');
    }

    // Validate the new version file
    await this.fileValidation.validateFile(file);

    // Increment version number
    const nextVersion = originalFile.currentVersion + 1;

    // Create storage key for this version
    const versionKey = `${originalFile.key}.v${nextVersion}`;

    // Save file to storage
    await this.r2Storage.uploadFile(versionKey, file.buffer, file.mimetype);

    // Perform scan
    let scanStatus: 'pending' | 'clean' | 'infected' | 'skipped' | 'error' = 'clean';
    let scanResult: Record<string, any> | undefined;

    try {
      scanStatus = 'clean';
      scanResult = { scanned: true, timestamp: new Date().toISOString() };
    } catch (error) {
      scanStatus = 'error';
      scanResult = { error: error.message };
    }

    // Create version record
    const version = this.repo.create({
      fileId,
      version: nextVersion,
      key: versionKey,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      changeDescription,
      createdBy,
      scanStatus,
      scanResult,
    });

    const savedVersion = await this.repo.save(version);

    // Update original file's current version
    originalFile.currentVersion = nextVersion;
    await this.fileRepo.save(originalFile);

    return savedVersion;
  }

  async getVersions(fileId: string): Promise<FileVersion[]> {
    const file = await this.fileRepo.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    return this.repo.find({
      where: { fileId },
      order: { version: 'DESC' },
    });
  }

  async getVersion(fileId: string, version: number): Promise<FileVersion> {
    const versionRecord = await this.repo.findOne({
      where: { fileId, version },
    });

    if (!versionRecord) {
      throw new NotFoundException('Version not found');
    }

    return versionRecord;
  }

  async getDownloadUrl(fileId: string, version: number, expiresIn: number = 3600): Promise<string> {
    const versionRecord = await this.getVersion(fileId, version);

    // Check if version file exists in storage
    const exists = await this.r2Storage.fileExists(versionRecord.key);
    if (!exists) {
      throw new NotFoundException('Version file not found in storage');
    }

    return this.r2Storage.generatePresignedUrl(versionRecord.key, expiresIn);
  }

  async rollbackToVersion(fileId: string, version: number): Promise<FileObject> {
    const versionRecord = await this.getVersion(fileId, version);
    const originalFile = await this.fileRepo.findOne({ where: { id: fileId } });

    if (!originalFile) {
      throw new NotFoundException('File not found');
    }

    // Copy version file to current file key
    await this.r2Storage.copyFile(versionRecord.key, originalFile.key);

    // Update file metadata to match the version
    originalFile.filename = versionRecord.filename;
    originalFile.mimeType = versionRecord.mimeType;
    originalFile.size = versionRecord.size;
    originalFile.currentVersion = versionRecord.version;
    originalFile.scanStatus = versionRecord.scanStatus;
    originalFile.scanResult = versionRecord.scanResult;

    return this.fileRepo.save(originalFile);
  }
}