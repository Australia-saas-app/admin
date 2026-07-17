import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, Max, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ description: 'Service title', example: 'Building Construction' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiPropertyOptional({ description: 'Service photo URL', example: 'https://example.com/photo.jpg' })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({ description: 'Service tag', example: 'residential' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  tag?: string;

  @ApiProperty({ description: 'Category name (will be created if not exists)', example: 'Residential Construction' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  category: string;

  @ApiProperty({ description: 'Service description', example: 'Professional construction services' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 5000)
  description: string;

  @ApiPropertyOptional({ description: 'Display order', example: 1, default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Visibility status', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}


