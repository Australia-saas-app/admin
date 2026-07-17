import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { DirectMessageController } from './direct-message.controller';
import { MessageService } from './message.service';
import { Message } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import { ConversationModule } from '../conversation/conversation.module';
import { GatewayModule } from '../gateway/gateway.module';
import { RulesModule } from '../rules/rules.module';
import { IntegrationModule } from '../integration/integration.module';
import { SimpleAuthGuard } from '../common/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    forwardRef(() => ConversationModule),
    RulesModule,
    IntegrationModule,
    forwardRef(() => GatewayModule),
  ],
  controllers: [MessageController, DirectMessageController],
  providers: [MessageService, SimpleAuthGuard],
  exports: [MessageService],
})
export class MessageModule {}

