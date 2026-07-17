import { IsString, IsOptional, IsArray } from 'class-validator';

export class CompanyDescriptionDto {
  @IsString()
  description: string;
}

export class CreateCompanyDto {
  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  descriptions?: string[];
}

