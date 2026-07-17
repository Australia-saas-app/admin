import { IsString, IsDateString } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  document: string; // PDF URL

  @IsString()
  title: string;

  @IsDateString()
  uploadDate: string;
}

