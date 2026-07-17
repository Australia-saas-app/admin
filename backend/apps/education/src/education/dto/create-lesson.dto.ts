import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Length,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLessonDto {
  @ApiProperty({
    description: "Lesson title",
    example: "Introduction to JavaScript",
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    description: "Lesson description",
    example: "Learn the basics of JavaScript programming",
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  description: string;

  @ApiPropertyOptional({
    description: "Video URL",
    example: "https://example.com/lesson1.mp4",
  })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({
    description: "Quiz data (JSON string)",
    example: '{"questions": []}',
  })
  @IsString()
  @IsOptional()
  quizData?: string;

  @ApiPropertyOptional({ description: "Order index", example: 1, default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({ description: "Duration in minutes", example: 30 })
  @IsInt()
  @IsOptional()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({
    description: "Active status",
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
