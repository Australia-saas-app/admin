import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { SocialLinkDto } from './create-branch.dto';

export class CreateEmployeeDto {
  @IsOptional()
  @IsString()
  photo?: string;

  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  officeAddress?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  socialLinks?: SocialLinkDto[];
}

