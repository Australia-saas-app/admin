import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, AdminRole } from '../entities/admin.entity';

@Injectable()
export class AdminManagementService {
  private readonly logger = new Logger(AdminManagementService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  private sanitizeAdmin(admin: Admin) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = admin as any;
    return rest;
  }

  async getAdmins(role?: string, page = 1, limit = 20) {
    const pageNum = page > 0 ? page : 1;
    const limitNum = limit > 0 ? Math.min(limit, 100) : 20;
    const skip = (pageNum - 1) * limitNum;

    const qb = this.adminRepository.createQueryBuilder('admin');
    if (role && role !== 'all') {
      qb.andWhere('admin.role = :role', { role });
    }

    const total = await qb.getCount();
    const admins = await qb
      .orderBy('admin.createdAt', 'DESC')
      .skip(skip)
      .take(limitNum)
      .getMany();

    const sanitized = admins.map((admin) => this.sanitizeAdmin(admin));

    const analytics = {
      total,
      byRole: {} as Record<AdminRole, number>,
    };

    for (const adminRole of Object.values(AdminRole)) {
      const count = await this.adminRepository.count({
        where: { role: adminRole },
      });
      analytics.byRole[adminRole] = count;
    }

    return {
      success: true,
      data: {
        admins: sanitized,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        analytics,
      },
    };
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const normalizedEmail = createAdminDto.email?.toLowerCase();
    if (!normalizedEmail) {
      throw new BadRequestException('Email is required');
    }

    const existing = await this.adminRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException('Admin with this email already exists');
    }

    const admin = this.adminRepository.create({
      email: normalizedEmail,
      password: createAdminDto.password,
      fullName: createAdminDto.fullName.trim(),
      role: createAdminDto.role || AdminRole.SUB_ADMIN,
      permissions: createAdminDto.permissions || [],
    });

    const saved = await this.adminRepository.save(admin);

    return {
      success: true,
      message: 'Admin created successfully',
      data: this.sanitizeAdmin(saved),
    };
  }

  async updateAdmin(adminId: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (updateAdminDto.fullName) {
      admin.fullName = updateAdminDto.fullName.trim();
    }

    if (updateAdminDto.role) {
      admin.role = updateAdminDto.role;
    }

    if (updateAdminDto.permissions) {
      admin.permissions = updateAdminDto.permissions;
    }

    const saved = await this.adminRepository.save(admin);

    return {
      success: true,
      message: 'Admin updated successfully',
      data: this.sanitizeAdmin(saved),
    };
  }

  async deleteAdmin(adminId: string) {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    await this.adminRepository.delete(adminId);

    return {
      success: true,
      message: 'Admin deleted successfully',
    };
  }

  async getAdminActivity(adminId: string) {
    this.logger.debug(`Fetching activity logs for admin ${adminId}`);
    return {
      success: true,
      data: {
        activities: [],
        total: 0,
      },
    };
  }
}


