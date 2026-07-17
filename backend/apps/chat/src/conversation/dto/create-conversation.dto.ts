import { IsString, IsOptional, IsEnum, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLiveChatDto {
  @ApiProperty({ description: 'Chat topic', example: 'Technical Support' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional({ description: 'Enable messaging', default: true })
  @IsOptional()
  @IsBoolean()
  messageEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable calls', default: false })
  @IsOptional()
  @IsBoolean()
  callEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable file uploads', default: false })
  @IsOptional()
  @IsBoolean()
  fileUploadEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable voice messages', default: false })
  @IsOptional()
  @IsBoolean()
  voiceUploadEnabled?: boolean;
}

export class CreateOrderChatDto {
  @ApiProperty({ description: 'Order ID', example: 'ORD000001' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiPropertyOptional({ description: 'Enable messaging', default: true })
  @IsOptional()
  @IsBoolean()
  messageEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable calls', default: false })
  @IsOptional()
  @IsBoolean()
  callEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable file uploads', default: false })
  @IsOptional()
  @IsBoolean()
  fileUploadEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable voice messages', default: false })
  @IsOptional()
  @IsBoolean()
  voiceUploadEnabled?: boolean;
}

export class CreateBusinessChatDto {
  @ApiPropertyOptional({ description: 'Optional topic for business chat' })
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiPropertyOptional({ description: 'Enable messaging', default: true })
  @IsOptional()
  @IsBoolean()
  messageEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable calls', default: false })
  @IsOptional()
  @IsBoolean()
  callEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable file uploads', default: false })
  @IsOptional()
  @IsBoolean()
  fileUploadEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable voice messages', default: false })
  @IsOptional()
  @IsBoolean()
  voiceUploadEnabled?: boolean;
}

