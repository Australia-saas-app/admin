import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class PresignedUploadDto {
  @IsString()
  @MaxLength(255)
  filename: string;

  @IsString()
  mimeType: string;

  @IsInt()
  @Min(1)
  size: number;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsString()
  folderId?: string;

  @IsOptional()
  tags?: string[];
}