import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationOfflineService } from './conversation-offline.service';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { RulesModule } from '../rules/rules.module';
import { GatewayModule } from '../gateway/gateway.module';
import { SimpleAuthGuard } from '../common/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    RulesModule,
    forwardRef(() => GatewayModule),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationOfflineService, SimpleAuthGuard],
  exports: [ConversationService, ConversationOfflineService],
})
export class ConversationModule {}

