import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class SocialLinkDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  icon: string;
}

export class CreateBranchDto {
  @IsOptional()
  @IsString()
  photo?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  call?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  officeAddress?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  socialLinks?: SocialLinkDto[];
}

