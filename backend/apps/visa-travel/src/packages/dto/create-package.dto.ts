import { IsArray, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  destination: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsIn(['visible', 'hidden'])
  status?: 'visible' | 'hidden';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  media?: string[];
}

