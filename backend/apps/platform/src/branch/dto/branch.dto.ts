import { IsString, IsOptional, IsArray, IsObject, IsNotEmpty } from "class-validator";

export class SocialLinkDto {
  @IsString()
  name: string;

  @IsString()
  url: string;
}

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  branchName: string;

  @IsOptional()
  @IsString()
  countryFlag?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  workingHours?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workingDays?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  socialLinks?: SocialLinkDto[];

  @IsOptional()
  @IsString()
  isVisible?: string;
}

export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  branchName?: string;

  @IsOptional()
  @IsString()
  countryFlag?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  workingHours?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workingDays?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  socialLinks?: SocialLinkDto[];

  @IsOptional()
  @IsString()
  isVisible?: string;
}
