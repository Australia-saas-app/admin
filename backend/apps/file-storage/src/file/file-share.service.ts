import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileShare } from './file-share.entity';
import { FileObject } from './file.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class FileShareService {
  constructor(
    @InjectRepository(FileShare)
    private readonly repo: Repository<FileShare>,
    @InjectRepository(FileObject)
    private readonly fileRepo: Repository<FileObject>,
  ) {}

  async createShare(
    fileId: string,
    createdBy?: string,
    expiresAt?: Date,
    password?: string,
    permissions: { view: boolean; download: boolean } = { view: true, download: true },
    maxAccesses?: number,
  ): Promise<FileShare> {
    const file = await this.fileRepo.findOne({ where: { id: fileId, isDeleted: false } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Generate unique share token
    const shareToken = randomBytes(32).toString('hex');

    const share = this.repo.create({
      fileId,
      shareToken,
      createdBy,
      password,
      permissions,
      expiresAt,
      maxAccesses,
      accessCount: 0,
      isActive: true,
    });

    return this.repo.save(share);
  }

  async getShares(fileId: string): Promise<FileShare[]> {
    const file = await this.fileRepo.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    return this.repo.find({
      where: { fileId },
      order: { createdAt: 'DESC' },
    });
  }

  async getShareByToken(shareToken: string, password?: string): Promise<{ share: FileShare; file: FileObject }> {
    const share = await this.repo.findOne({
      where: { shareToken, isActive: true },
      relations: ['file'],
    });

    if (!share) {
      throw new NotFoundException('Share not found or expired');
    }

    // Check expiration
    if (share.expiresAt && share.expiresAt < new Date()) {
      throw new ForbiddenException('Share has expired');
    }

    // Check access limit
    if (share.maxAccesses && share.accessCount >= share.maxAccesses) {
      throw new ForbiddenException('Share access limit exceeded');
    }

    // Check password
    if (share.password && share.password !== password) {
      throw new ForbiddenException('Invalid share password');
    }

    // Increment access count
    share.accessCount += 1;
    await this.repo.save(share);

    return { share, file: await share.file };
  }

  async deleteShare(id: string): Promise<void> {
    const share = await this.repo.findOne({ where: { id } });
    if (!share) {
      throw new NotFoundException('Share not found');
    }

    await this.repo.delete(id);
  }

  async updateShare(
    id: string,
    updates: Partial<Pick<FileShare, 'expiresAt' | 'password' | 'permissions' | 'maxAccesses' | 'isActive'>>
  ): Promise<FileShare> {
    const share = await this.repo.findOne({ where: { id } });
    if (!share) {
      throw new NotFoundException('Share not found');
    }

    Object.assign(share, updates);
    return this.repo.save(share);
  }
}