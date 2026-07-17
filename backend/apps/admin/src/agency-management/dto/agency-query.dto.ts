import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';

export enum AgencyStatus {
  PENDING = 'pending',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked',
  DORMANT = 'dormant',
  CLOSED = 'closed',
}

export enum BusinessType {
  TECHNICAL = 'technical',
  CONSTRUCTION = 'construction',
  REAL_ESTATE = 'real_estate',
  IMPORT_EXPORT = 'import_export',
  VISA_TRAVEL = 'visa_travel',
  SOLUTIONS = 'solutions',
}

export class AgencyQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AgencyStatus)
  status?: AgencyStatus;

  @IsOptional()
  @IsEnum(BusinessType)
  businessType?: BusinessType;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

