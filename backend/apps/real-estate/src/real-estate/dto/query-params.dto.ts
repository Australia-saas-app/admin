import { IsOptional, IsString, IsInt, IsNumber, Min, IsBoolean, IsIn, ValidateIf } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PropertyQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search by property type' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return value;
  })
  @IsString()
  propertyType?: string;

  @ApiPropertyOptional({ description: 'Filter by property status', enum: ['Rent', 'Buy', 'Sale', 'Mortgage'] })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return value;
  })
  @ValidateIf((o, value) => value !== undefined && value !== null && value !== '')
  @IsString()
  @ValidateIf((o, value) => value !== undefined && value !== null && value !== '')
  @IsIn(['Rent', 'Buy', 'Sale', 'Mortgage'])
  propertyStatus?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @ValidateIf((o, value) => value !== undefined && value !== null)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @ValidateIf((o, value) => value !== undefined && value !== null)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by visibility (true/false, omit to show all)', example: true })
  @IsOptional()
  @Transform(({ value }) => {
    // Convert empty string, null, or undefined to undefined
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    // Convert string 'true'/'false' to boolean
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      if (lower === '' || lower === 'null' || lower === 'undefined') {
        return undefined;
      }
      // Return boolean true/false for valid strings
      return lower === 'true';
    }
    // Already a boolean - return as is (false is a valid filter value when explicitly provided)
    return Boolean(value);
  })
  @ValidateIf((o, value) => value !== undefined && value !== null)
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return value;
  })
  @IsString()
  category?: string;
}

export class CategoryQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 50, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @ApiPropertyOptional({ description: 'Filter by active status', example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}

export class ReorderDto {
  @ApiPropertyOptional({ description: 'Direction to move', enum: ['up', 'down'] })
  @IsString()
  @IsIn(['up', 'down'])
  direction: 'up' | 'down';
}

