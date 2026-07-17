import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(name: string, permissions: string[], description?: string): Promise<Role> {
    const role = this.roleRepository.create({
      name,
      permissions,
      description,
    });
    return await this.roleRepository.save(role);
  }

  async getRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    // Logic to assign role, but since many to many, need to handle in user service
  }
}