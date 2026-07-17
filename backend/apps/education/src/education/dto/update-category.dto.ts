import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Length,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: "Category name",
    example: "Advanced Programming",
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional({
    description: "Category description",
    example: "Updated description",
  })
  @IsString()
  @IsOptional()
  @Length(1, 1000)
  description?: string;

  @ApiPropertyOptional({ description: "Display order", example: 2 })
  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: "Active status", example: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
