import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiPropertyOptional({
    description: 'Blog photo URL',
    example: 'https://example.com/blog-photo.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({
    description: 'Blog title',
    example: 'Getting Started with NestJS',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Blog tag',
    example: 'nestjs, backend, tutorial',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tag?: string;

  @ApiPropertyOptional({
    description: 'Blog description/content',
    example: 'This is a comprehensive guide to getting started with NestJS...',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;
}

