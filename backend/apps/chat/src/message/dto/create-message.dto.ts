import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTextMessageDto {
  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Sender name' })
  @IsString()
  @IsOptional()
  senderName?: string;

  @ApiPropertyOptional({ description: 'Receiver name' })
  @IsString()
  @IsOptional()
  receiverName?: string;
}

export class CreateFileMessageDto {
  @ApiProperty({ description: 'File URL from file storage service' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: 'File name' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'MIME type' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNotEmpty()
  size: number;

  @ApiPropertyOptional({ description: 'Optional message caption' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ description: 'Sender name' })
  @IsString()
  @IsOptional()
  senderName?: string;

  @ApiPropertyOptional({ description: 'Receiver name' })
  @IsString()
  @IsOptional()
  receiverName?: string;
}

export class CreateVoiceMessageDto {
  @ApiProperty({ description: 'Voice file URL from file storage service' })
  @IsString()
  @IsNotEmpty()
  voiceUrl: string;

  @ApiPropertyOptional({ description: 'Optional message caption' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ description: 'Sender name' })
  @IsString()
  @IsOptional()
  senderName?: string;

  @ApiPropertyOptional({ description: 'Receiver name' })
  @IsString()
  @IsOptional()
  receiverName?: string;
}

export class CreateCallMessageDto {
  @ApiProperty({ description: 'Call duration in seconds' })
  @IsNotEmpty()
  callDuration: number;

  @ApiPropertyOptional({ description: 'Call status', enum: ['completed', 'missed', 'rejected'] })
  @IsEnum(['completed', 'missed', 'rejected'])
  @IsOptional()
  status?: string;
}


export class UserToBusinessMessageDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Sender name' })
  @IsString()
  @IsOptional()
  senderName?: string;

  @ApiPropertyOptional({ description: 'Receiver name' })
  @IsString()
  @IsOptional()
  receiverName?: string;

  @ApiPropertyOptional({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  attachments?: any[];
}

export class BusinessToUserMessageDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Sender name' })
  @IsString()
  @IsOptional()
  senderName?: string;

  @ApiPropertyOptional({ description: 'Receiver name' })
  @IsString()
  @IsOptional()
  receiverName?: string;

  @ApiPropertyOptional({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  attachments?: any[];
}
