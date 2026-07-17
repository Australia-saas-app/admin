import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListFilesDto {
  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsString()
  folderId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tag?: string;

   @IsOptional()
   @Transform(({ value }) => parseInt(value))
   @IsInt()
   @Min(0)
   @Max(1000)
   limit?: number;

   @IsOptional()
   @Transform(({ value }) => parseInt(value))
   @IsInt()
   @Min(0)
   offset?: number;
}

