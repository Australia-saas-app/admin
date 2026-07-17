import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../entities/user.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getBusinessProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user || (user.accountType !== 'business' && user.accountType !== 'agency')) {
      throw new NotFoundException('Business or Agency not found');
    }

    return {
      userId: user.userId,
      accountType: user.accountType,
      businessInfo: user.businessInfo,
      agencyInfo: user.agencyInfo,
      status: user.status,
      fullName: user.fullName,
    };
  }

  async updateBusinessProfile(userId: string, updates: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user || user.accountType !== 'business') {
      throw new NotFoundException('Business not found');
    }

    if (updates.businessInfo) {
      user.businessInfo = { ...user.businessInfo, ...updates.businessInfo };
    }

    return await this.userRepository.save(user);
  }

  async verifyBusiness(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user || user.accountType !== 'business') {
      throw new NotFoundException('Business not found');
    }

    // Add verification logic
    user.status = UserStatus.ACTIVE;
    return await this.userRepository.save(user);
  }

  async approveBusiness(userId: string): Promise<User> {
    return await this.verifyBusiness(userId);
  }

  async updateBusinessStatus(userId: string, status: UserStatus): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user || user.accountType !== 'business') {
      throw new NotFoundException('Business not found');
    }

    user.status = status;
    return await this.userRepository.save(user);
  }

  async getBusinessRoles(userId: string): Promise<any> {
    // Placeholder for roles
    return { roles: ['owner', 'manager'] };
  }

  async assignBusinessRole(userId: string, role: string): Promise<any> {
    // Placeholder
    return { userId, role };
  }
}