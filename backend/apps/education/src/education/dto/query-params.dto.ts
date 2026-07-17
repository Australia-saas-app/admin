import {
  IsOptional,
  IsBoolean,
  IsInt,
  IsString,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CourseQueryDto {
  @ApiPropertyOptional({ description: "Page number", example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page",
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: "Search term", example: "javascript" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Category ID", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ description: "Instructor ID", example: "user123" })
  @IsOptional()
  @IsString()
  instructorId?: string;

  @ApiPropertyOptional({
    description: "Sort by field",
    example: "createdAt",
    enum: ["title", "createdAt", "price", "displayOrder"],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt";

  @ApiPropertyOptional({
    description: "Sort order",
    example: "DESC",
    enum: ["ASC", "DESC"],
  })
  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC" = "DESC";

  @ApiPropertyOptional({
    description: "Visibility filter (admin only)",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class CategoryQueryDto {
  @ApiPropertyOptional({ description: "Page number", example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page",
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: "Search term", example: "programming" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Sort by field",
    example: "createdAt",
    enum: ["name", "createdAt", "displayOrder"],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt";

  @ApiPropertyOptional({
    description: "Sort order",
    example: "DESC",
    enum: ["ASC", "DESC"],
  })
  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC" = "DESC";

  @ApiPropertyOptional({
    description: "Active filter (admin only)",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class LessonQueryDto {
  @ApiPropertyOptional({ description: "Course ID", example: "EDU-ABC123" })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    description: "Active filter",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: "Sort by field",
    example: "orderIndex",
    enum: ["title", "orderIndex", "createdAt"],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = "orderIndex";

  @ApiPropertyOptional({
    description: "Sort order",
    example: "ASC",
    enum: ["ASC", "DESC"],
  })
  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC" = "ASC";
}

export class EnrollmentQueryDto {
  @ApiPropertyOptional({ description: "Page number", example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page",
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: "Course ID", example: "EDU-ABC123" })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ description: "Student ID", example: "user123" })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ description: "Completion status", example: true })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({
    description: "Sort by field",
    example: "enrollmentDate",
    enum: ["enrollmentDate", "completionPercentage"],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = "enrollmentDate";

  @ApiPropertyOptional({
    description: "Sort order",
    example: "DESC",
    enum: ["ASC", "DESC"],
  })
  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC" = "DESC";
}

export class ReorderDto {
  @ApiProperty({
    description: "Reorder direction",
    example: "up",
    enum: ["up", "down"],
  })
  @IsString()
  direction: "up" | "down";
}
