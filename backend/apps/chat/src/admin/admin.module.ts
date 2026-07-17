import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Conversation } from '../entities/conversation.entity';
import { ChatAssignment } from '../entities/chat-assignment.entity';
import { PredefinedMessage } from '../entities/predefined-message.entity';
import { Message } from '../entities/message.entity';
import { IntegrationModule } from '../integration/integration.module';
import { SimpleAuthGuard } from '../common/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ChatAssignment, PredefinedMessage, Message]),
    IntegrationModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, SimpleAuthGuard],
  exports: [AdminService],
})
export class AdminModule {}

