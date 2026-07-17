import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';

export enum ServiceType {
  TECHNICAL = 'technical',
  CONSTRUCTION = 'construction',
  REAL_ESTATE = 'real_estate',
  IMPORT_EXPORT = 'import_export',
  VISA_TRAVELING = 'visa_traveling',
  SOLUTIONS = 'solutions',
}

export class ServiceQueryDto {
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
  @IsEnum(ServiceType)
  serviceType?: ServiceType;
}

