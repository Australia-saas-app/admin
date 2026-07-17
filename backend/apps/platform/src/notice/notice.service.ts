import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notice, NoticePriority } from "../entities/notice.entity";
import { NoticeFileStorageService } from "./notice-file-storage.service";

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
    private noticeFileStorageService: NoticeFileStorageService,
  ) {}

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [notices, total] = await Promise.all([
      this.noticeRepository.find({
        where: { isVisible: true },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.noticeRepository.count({ where: { isVisible: true } }),
    ]);

    return {
      data: notices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllAdmin(page: number = 1, limit: number = 20, filters?: { priority?: string }) {
    const skip = (page - 1) * limit;
    
    const whereConditions: any = {};
    if (filters?.priority) {
      whereConditions.priority = filters.priority;
    }

    const [notices, total] = await Promise.all([
      this.noticeRepository.find({
        where: whereConditions,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['creator'],
      }),
      this.noticeRepository.count({ where: whereConditions }),
    ]);

    return {
      data: notices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException("Notice not found");
    }
    return notice;
  }

  async create(createNoticeDto: {
    title: string;
    description?: string;
    file?: {
      fileId?: string;
      fileKey?: string;
      url?: string;
      fileName?: string;
      mimeType?: string;
      size?: number;
      type?: 'photo' | 'pdf';
    };
    priority?: NoticePriority;
    isVisible?: boolean;
    createdBy?: string;
  }) {
    const notice = this.noticeRepository.create({
      title: createNoticeDto.title,
      description: createNoticeDto.description,
      file: createNoticeDto.file,
      priority: createNoticeDto.priority || NoticePriority.INFO,
      isVisible: createNoticeDto.isVisible ?? true,
      createdBy: createNoticeDto.createdBy,
    });

    return await this.noticeRepository.save(notice);
  }

  async update(
    id: string,
    updateNoticeDto: {
      title?: string;
      description?: string;
      file?: {
        fileId?: string;
        fileKey?: string;
        url?: string;
        fileName?: string;
        mimeType?: string;
        size?: number;
        type?: 'photo' | 'pdf';
      };
      priority?: NoticePriority;
      isVisible?: boolean;
    }
  ) {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException("Notice not found");
    }

    if (updateNoticeDto.title !== undefined) notice.title = updateNoticeDto.title;
    if (updateNoticeDto.description !== undefined) notice.description = updateNoticeDto.description;
    if (updateNoticeDto.file !== undefined) notice.file = updateNoticeDto.file;
    if (updateNoticeDto.priority !== undefined) notice.priority = updateNoticeDto.priority;
    if (updateNoticeDto.isVisible !== undefined) notice.isVisible = updateNoticeDto.isVisible;

    return await this.noticeRepository.save(notice);
  }

  async uploadFile(
    id: string,
    file: Express.Multer.File,
  ): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException("Notice not found");
    }

    const folderId = await this.noticeFileStorageService.getNoticeFolderId();
    const uploadResult = await this.noticeFileStorageService.uploadFile(file, folderId);
    const fileType = this.detectFileType(file.mimetype);

    notice.file = {
      fileId: uploadResult.id,
      fileKey: uploadResult.key,
      url: uploadResult.url,
      fileName: uploadResult.fileName,
      mimeType: uploadResult.mimeType,
      size: uploadResult.size,
      type: fileType,
    };

    return await this.noticeRepository.save(notice);
  }

  private detectFileType(mimeType: string): 'photo' | 'pdf' {
    if (mimeType === 'application/pdf') {
      return 'pdf';
    }
    return 'photo';
  }

  async remove(id: string) {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException("Notice not found");
    }

    if (notice.file?.fileId) {
      await this.noticeFileStorageService.deleteFile(notice.file.fileId);
    }

    await this.noticeRepository.remove(notice);
    return { message: "Notice deleted successfully" };
  }

  async toggleVisibility(id: string): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException("Notice not found");
    }

    notice.isVisible = !notice.isVisible;
    return await this.noticeRepository.save(notice);
  }

  async markAsRead(id: string): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException("Notice not found");
    }

    notice.isRead = true;
    return await this.noticeRepository.save(notice);
  }

  async findByPriority(priority: NoticePriority) {
    return await this.noticeRepository.find({
      where: { priority, isVisible: true },
      order: { createdAt: 'DESC' },
    });
  }

  async search(name: string): Promise<Notice[]> {
    return this.noticeRepository
      .createQueryBuilder("notice")
      .where("notice.title ILIKE :name", { name: `%${name}%` })
      .orderBy("notice.createdAt", "DESC")
      .getMany();
  }

  async getNoticeFolderId(): Promise<string> {
    return this.noticeFileStorageService.getNoticeFolderId();
  }

  async uploadFileToStorage(
    file: Express.Multer.File,
    folderId: string,
  ): Promise<{ id: string; key: string; url?: string; fileName: string; mimeType: string; size: number }> {
    return this.noticeFileStorageService.uploadFile(file, folderId);
  }
}
