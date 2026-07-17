import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { AdminRole } from '../../entities/admin.entity';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}


