import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class GalleryImageDto {
  @IsString()
  image: string;

  @IsString()
  title: string;
}

export class CreateGalleryDto {
  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  images?: GalleryImageDto[];
}

