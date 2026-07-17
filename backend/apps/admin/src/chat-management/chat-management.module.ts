import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatManagementController } from './chat-management.controller';
import { ChatManagementService } from './chat-management.service';
import { ChatTopic } from '../entities/chat-topic.entity';
import { PredefinedMessage } from '../entities/predefined-message.entity';
import { Conversation } from '../entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatTopic, PredefinedMessage, Conversation])],
  controllers: [ChatManagementController],
  providers: [ChatManagementService],
  exports: [ChatManagementService],
})
export class ChatManagementModule {}




