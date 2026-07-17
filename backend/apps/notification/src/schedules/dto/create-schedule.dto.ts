import { IsString, IsOptional, IsArray, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  notificationType: string;

  @ApiProperty()
  @IsObject()
  templateData: any; // Data to be used with template

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  targetUsers: string[]; // User IDs to send to

  @ApiProperty()
  @IsString()
  cronExpression: string; // Cron expression for scheduling

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  channels?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    inApp?: boolean;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}