import { IsOptional, IsString, IsInt, Min, IsEnum, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProjectStatus } from '../entities/project.entity';

export class ProjectQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value === '' ? undefined : value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  search?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  createdBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  price?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  category?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  paymentType?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'all' ? undefined : value))
  skills?: string;
}
