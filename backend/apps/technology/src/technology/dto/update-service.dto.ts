import { IsString, IsOptional, IsBoolean, IsInt, Min, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'Service title' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  title?: string;

  @ApiPropertyOptional({ description: 'Service photo URL' })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({ description: 'Service tag' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  tag?: string;

  @ApiPropertyOptional({ description: 'Category name (will be created if not exists)' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  category?: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsString()
  @IsOptional()
  @Length(1, 5000)
  description?: string;

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
