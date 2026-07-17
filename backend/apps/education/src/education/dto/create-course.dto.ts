import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  Min,
  Length,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty({
    description: "Course title",
    example: "Complete Web Development Bootcamp",
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    description: "Course description",
    example: "Learn full-stack web development from scratch",
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 5000)
  description: string;

  @ApiPropertyOptional({
    description: "Course thumbnail URL",
    example: "https://example.com/thumbnail.jpg",
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: "Course tag",
    example: "web-development",
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  tag?: string;

  @ApiProperty({
    description: "Category name (will be created if not exists)",
    example: "Programming",
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  category: string;

  @ApiPropertyOptional({ description: "Instructor ID", example: "user123" })
  @IsString()
  @IsOptional()
  instructorId?: string;

  @ApiPropertyOptional({
    description: "Course price",
    example: 99.99,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: "Currency",
    example: "USD",
    default: "USD",
  })
  @IsString()
  @IsOptional()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({ description: "Duration in hours", example: 40 })
  @IsInt()
  @IsOptional()
  @Min(1)
  durationHours?: number;

  @ApiPropertyOptional({
    description: "Video URLs (JSON string)",
    example: '["url1", "url2"]',
  })
  @IsString()
  @IsOptional()
  videoUrls?: string;

  @ApiPropertyOptional({ description: "Display order", example: 1, default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({
    description: "Visibility status",
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
