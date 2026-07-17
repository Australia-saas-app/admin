import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminFileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  fileType: string;
}

export class AddFilesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminFileDto)
  @ArrayMaxSize(20)
  files: AdminFileDto[];
}


