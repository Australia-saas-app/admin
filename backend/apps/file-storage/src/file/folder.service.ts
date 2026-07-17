import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly repo: Repository<Folder>,
  ) {}

  async create(name: string, ownerId?: string, parentId?: string): Promise<Folder> {
    // Validate parent exists if provided
    if (parentId) {
      const parent = await this.repo.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    // Build full path
    const path = await this.buildPath(name, parentId);

    // Check for duplicate path
    const existing = await this.repo.findOne({ where: { path } });
    if (existing) {
      throw new BadRequestException('Folder with this path already exists');
    }

    const folder = this.repo.create({
      name,
      path,
      parentId,
      ownerId,
      isDeleted: false,
    });

    return this.repo.save(folder);
  }

  async findAll(ownerId?: string): Promise<Folder[]> {
    const query = this.repo.createQueryBuilder('folder')
      .where('folder.isDeleted = false');

    if (ownerId) {
      query.andWhere('folder.ownerId = :ownerId', { ownerId });
    }

    return query.orderBy('folder.path', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Folder> {
    const folder = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    return folder;
  }

  async update(id: string, name: string): Promise<Folder> {
    const folder = await this.findOne(id);

    // If name changed, rebuild path
    if (folder.name !== name) {
      const newPath = await this.buildPath(name, folder.parentId);

      // Check for duplicate path
      const existing = await this.repo.findOne({ where: { path: newPath } });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Folder with this path already exists');
      }

      folder.name = name;
      folder.path = newPath;
    }

    return this.repo.save(folder);
  }

  async delete(id: string): Promise<void> {
    const folder = await this.findOne(id);

    // Check if folder has files or subfolders
    const hasFiles = await this.repo.query(
      'SELECT COUNT(*) as count FROM files WHERE "folderId" = $1 AND "isDeleted" = false',
      [id]
    );

    const hasSubfolders = await this.repo.count({
      where: { parentId: id, isDeleted: false }
    });

    if (parseInt(hasFiles[0].count) > 0 || hasSubfolders > 0) {
      throw new BadRequestException('Cannot delete folder with files or subfolders');
    }

    folder.isDeleted = true;
    await this.repo.save(folder);
  }

  private async buildPath(name: string, parentId?: string): Promise<string> {
    if (!parentId) {
      return name;
    }

    const parent = await this.repo.findOne({ where: { id: parentId } });
    if (!parent) {
      throw new NotFoundException('Parent folder not found');
    }

    return `${parent.path}/${name}`;
  }
}