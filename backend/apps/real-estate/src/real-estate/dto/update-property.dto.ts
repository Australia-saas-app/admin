import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  IsArray,
  Min,
  Length,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePropertyDto {
  @ApiPropertyOptional({ description: 'Property type' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  propertyType?: string;

  @ApiPropertyOptional({ description: 'Property status' })
  @IsString()
  @IsOptional()
  propertyStatus?: string;

  @ApiPropertyOptional({ description: 'Current status' })
  @IsString()
  @IsOptional()
  currentStatus?: string;

  @ApiPropertyOptional({ description: 'Property photos (multiple)', type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  photos?: string[];

  @ApiPropertyOptional({ description: 'Property description' })
  @IsString()
  @IsOptional()
  @Length(10, 1000)
  description?: string;

  @ApiPropertyOptional({ description: 'Size in square feet' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  sizeSquareFeet?: number;

  @ApiPropertyOptional({ description: 'Price/Budget' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Property features', type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  features?: string[];

  // Residential Properties Fields
  @ApiPropertyOptional({ description: 'Number of beds' })
  @IsInt()
  @IsOptional()
  @Min(0)
  beds?: number;

  @ApiPropertyOptional({ description: 'Number of bathrooms' })
  @IsInt()
  @IsOptional()
  @Min(0)
  bathroom?: number;

  @ApiPropertyOptional({ description: 'Number of kitchens' })
  @IsInt()
  @IsOptional()
  @Min(0)
  kitchen?: number;

  @ApiPropertyOptional({ description: 'Category name (will be created if not exists)' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  category?: string;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Visibility status' })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}


