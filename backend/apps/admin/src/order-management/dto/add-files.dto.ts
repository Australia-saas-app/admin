import { IsArray, IsString } from 'class-validator';

export class AddFilesDto {
  @IsArray()
  @IsString({ each: true })
  fileUrls: string[];
}

