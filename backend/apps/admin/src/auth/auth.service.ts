import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { JwtService } from '../common/services/jwt.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ConfigService } from '@nestjs/config';
import { AdminRole } from '../entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private normalizeEmail(email?: string) {
    return email?.trim().toLowerCase();
  }

  async registerAdmin(registerDto: RegisterAdminDto) {
    const normalizedEmail = this.normalizeEmail(registerDto.email);

    if (!normalizedEmail || !registerDto.password || !registerDto.fullName) {
      throw new BadRequestException('Email, password, and full name are required');
    }

    const bootstrapSecret = this.configService.get<string>('ADMIN_BOOTSTRAP_SECRET');
    if (bootstrapSecret && registerDto.bootstrapSecret !== bootstrapSecret) {
      throw new ForbiddenException('Invalid bootstrap secret');
    }

    const existing = await this.adminRepository.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      throw new BadRequestException('Admin already exists with this email');
    }

    const adminCount = await this.adminRepository.count();
    if (adminCount > 0 && !registerDto.allowAdditional) {
      throw new ForbiddenException('Use Admin Management endpoints to add more admins');
    }

    const admin = this.adminRepository.create({
      email: normalizedEmail,
      password: registerDto.password,
      fullName: registerDto.fullName.trim(),
      role: registerDto.role ?? AdminRole.SUPER_ADMIN,
      permissions: registerDto.permissions || [],
    });

    const saved = await this.adminRepository.save(admin);

    return {
      success: true,
      message: 'Admin registered successfully',
      data: {
        id: saved.id,
        email: saved.email,
        fullName: saved.fullName,
        role: saved.role,
        permissions: saved.permissions,
      },
    };
  }

  async adminLogin(adminLoginDto: AdminLoginDto) {
    const normalizedEmail = this.normalizeEmail(adminLoginDto.email);

    if (!normalizedEmail || !adminLoginDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const admin = await this.adminRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await admin.comparePassword(adminLoginDto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    admin.lastLogin = new Date();
    await this.adminRepository.save(admin);

    const tokenResult = this.jwtService.signAdminToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      success: true,
      message: 'Login successful',
      data: {
        token: tokenResult.token,
        expiresIn: this.jwtService.getAccessTokenTtlSeconds(),
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          permissions: admin.permissions,
        },
      },
    };
  }
}


