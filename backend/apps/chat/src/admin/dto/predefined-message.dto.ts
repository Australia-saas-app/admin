import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePredefinedMessageDto {
  @ApiProperty({ description: 'Message title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Message category' })
  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdatePredefinedMessageDto {
  @ApiPropertyOptional({ description: 'Message title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Message content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Message category' })
  @IsString()
  @IsOptional()
  category?: string;
}

