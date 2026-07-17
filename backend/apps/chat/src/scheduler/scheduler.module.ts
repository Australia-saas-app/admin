import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageCleanupService } from './message-cleanup.service';
import { AssignmentTimeoutService } from './assignment-timeout.service';
import { LiveChatOfflineCleanupService } from './live-chat-offline-cleanup.service';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';
import { AdminModule } from '../admin/admin.module';
import { GatewayModule } from '../gateway/gateway.module';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Conversation, Message]),
    ConversationModule,
    MessageModule,
    AdminModule,
    GatewayModule,
  ],
  providers: [
    MessageCleanupService,
    AssignmentTimeoutService,
    LiveChatOfflineCleanupService,
  ],
})
export class SchedulerModule {}

