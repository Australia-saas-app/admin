import { IsEmail, IsOptional, IsString } from 'class-validator';

export class VerifyContactOtpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  type?: string;
}






