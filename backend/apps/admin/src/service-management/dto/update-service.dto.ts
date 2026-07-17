import { IsOptional, IsString, IsArray, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { ServiceType } from './service-query.dto';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  // Real Estate specific fields
  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsString()
  propertyStatus?: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsNumber()
  beds?: number;

  @IsOptional()
  @IsNumber()
  bathroom?: number;

  @IsOptional()
  @IsNumber()
  kitchen?: number;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}

