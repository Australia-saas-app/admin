import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  Min,
  Length,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description: "Course title",
    example: "Updated Course Title",
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  title?: string;

  @ApiPropertyOptional({
    description: "Course description",
    example: "Updated description",
  })
  @IsString()
  @IsOptional()
  @Length(1, 5000)
  description?: string;

  @ApiPropertyOptional({
    description: "Course thumbnail URL",
    example: "https://example.com/new-thumbnail.jpg",
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ description: "Course tag", example: "updated-tag" })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  tag?: string;

  @ApiPropertyOptional({
    description: "Category name",
    example: "New Category",
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  category?: string;

  @ApiPropertyOptional({ description: "Instructor ID", example: "user456" })
  @IsString()
  @IsOptional()
  instructorId?: string;

  @ApiPropertyOptional({ description: "Course price", example: 149.99 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: "Currency", example: "EUR" })
  @IsString()
  @IsOptional()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({ description: "Duration in hours", example: 50 })
  @IsInt()
  @IsOptional()
  @Min(1)
  durationHours?: number;

  @ApiPropertyOptional({
    description: "Video URLs (JSON string)",
    example: '["new-url1", "new-url2"]',
  })
  @IsString()
  @IsOptional()
  videoUrls?: string;

  @ApiPropertyOptional({ description: "Display order", example: 2 })
  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: "Visibility status", example: false })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
