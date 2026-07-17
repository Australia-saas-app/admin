import { IsString, IsEnum, IsOptional } from 'class-validator';
import { MessageType } from '../entities/project-message.entity';

export class CreateMessageDto {
  @IsEnum(MessageType)
  messageType: MessageType;

  @IsString()
  content: string;
}

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;
}
