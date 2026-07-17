import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Web Development' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({ description: 'Category description', example: 'Web development services' })
  @IsString()
  @IsOptional()
  @Length(1, 1000)
  description?: string;

  @ApiPropertyOptional({ description: 'Display order', example: 1, default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Active status', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
