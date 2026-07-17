import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
  MaxLength,
} from 'class-validator';

export class UpdatePreferenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  @IsOptional()
  @IsEnum(['light', 'dark', 'system'])
  theme?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsEnum(['email', 'phone'])
  twoFactorMethod?: string;

  @IsOptional()
  @IsObject()
  notificationSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  privacySettings?: Record<string, any>;
}
