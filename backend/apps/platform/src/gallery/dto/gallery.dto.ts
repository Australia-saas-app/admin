import { IsString, IsOptional, IsObject, IsEnum, IsNumber } from "class-validator";
import { MediaType } from "../../entities/gallery.entity";

export class MediaDto {
  @IsOptional()
  @IsString()
  fileId?: string;

  @IsOptional()
  @IsString()
  fileKey?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  size?: number;
}

export class CreateGalleryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsObject()
  media?: MediaDto;

  @IsOptional()
  @IsString()
  isVisible?: boolean;
}

export class UpdateGalleryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsObject()
  media?: MediaDto;

  @IsOptional()
  @IsString()
  isVisible?: boolean;
}

export class UploadMediaDto {
  @IsOptional()
  @IsString()
  type?: "photo" | "video";

  @IsOptional()
  @IsString()
  fileName?: string;
}
