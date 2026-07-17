import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePreferenceDto {
  @ApiProperty()
  @IsString()
  notificationType: string; // order_updates, promotions, security, etc.

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  channels?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  schedule?: {
    startTime?: string; // HH:mm format
    endTime?: string; // HH:mm format
    daysOfWeek?: number[]; // 0-6, Sunday = 0
  };
}