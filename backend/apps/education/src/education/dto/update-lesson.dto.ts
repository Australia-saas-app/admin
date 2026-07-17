import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Length,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateLessonDto {
  @ApiPropertyOptional({
    description: "Lesson title",
    example: "Updated Lesson Title",
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  title?: string;

  @ApiPropertyOptional({
    description: "Lesson description",
    example: "Updated description",
  })
  @IsString()
  @IsOptional()
  @Length(1, 2000)
  description?: string;

  @ApiPropertyOptional({
    description: "Video URL",
    example: "https://example.com/new-lesson.mp4",
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

  @ApiPropertyOptional({ description: "Order index", example: 2 })
  @IsInt()
  @IsOptional()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({ description: "Duration in minutes", example: 45 })
  @IsInt()
  @IsOptional()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ description: "Active status", example: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
