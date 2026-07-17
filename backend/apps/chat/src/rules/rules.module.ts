import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRulesService } from './chat-rules.service';
import { OrderChatValidator } from './order-chat-validator';
import { BusinessChatValidator } from './business-chat-validator';
import { FileUploadValidator } from './file-upload-validator';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { IntegrationModule } from 'src/integration/integration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    IntegrationModule,
  ],
  providers: [
    ChatRulesService,
    OrderChatValidator,
    BusinessChatValidator,
    FileUploadValidator,
  ],
  exports: [
    ChatRulesService,
    OrderChatValidator,
    BusinessChatValidator,
    FileUploadValidator,
  ],
})
export class RulesModule {}

