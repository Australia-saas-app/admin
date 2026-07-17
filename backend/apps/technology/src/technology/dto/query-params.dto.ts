import { IsOptional, IsString, IsInt, Min, IsBoolean, IsIn, ValidateIf } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceQueryDto {
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

  @ApiPropertyOptional({ description: 'Search by title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by visibility (true/false, omit to show all)',
    example: true,
  })
  @IsOptional()
  @ValidateIf((o, value) => value !== undefined && value !== null && value !== '')
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
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by user ID (creator)' })
  @IsOptional()
  @IsString()
  userId?: string;
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
