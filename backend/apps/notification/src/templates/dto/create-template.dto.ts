import { IsString, IsOptional, IsArray, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string; // welcome, order_confirmation, password_reset, etc.

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  subject: string; // For email templates

  @ApiProperty()
  @IsString()
  content: string; // Template content with placeholders like {{userName}}, {{orderId}}

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[]; // List of required variables for the template

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: any; // Additional template metadata

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}