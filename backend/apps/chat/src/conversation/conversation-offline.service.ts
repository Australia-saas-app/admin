import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../gateway/presence.service';

@Injectable()
export class ConversationOfflineService {
  private readonly logger = new Logger(ConversationOfflineService.name);
  private readonly liveChatOfflineTimeoutMinutes: number;

  constructor(
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private readonly presenceService: PresenceService,
    private readonly configService: ConfigService,
  ) {
    this.liveChatOfflineTimeoutMinutes = Number(
      this.configService.get('LIVE_CHAT_OFFLINE_TIMEOUT_MINUTES', 15),
    );
  }

  async updateUserLastSeen(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (conversation) {
      const userLastSeenAt = { ...conversation.userLastSeenAt };
      userLastSeenAt[userId] = new Date();
      await this.conversationRepository.update(conversationId, { userLastSeenAt });
    }
  }

  async checkAndCleanupOfflineMessages(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation || conversation.type !== 'live') {
      return;
    }

    const userLastSeen = conversation.userLastSeenAt?.[userId];
    if (!userLastSeen) {
      return;
    }

    const isOnline = await this.presenceService.isUserOnline(userId);
    
    if (isOnline) {
      await this.updateUserLastSeen(conversationId, userId);
      return;
    }

    const now = new Date();
    const minutesOffline = (now.getTime() - new Date(userLastSeen).getTime()) / (1000 * 60);

    if (minutesOffline >= this.liveChatOfflineTimeoutMinutes) {
      await this.messageRepository.delete({ conversationId });
      this.logger.log(`Deleted messages for conversation ${conversationId} - user ${userId} offline for ${minutesOffline} minutes`);
    }
  }
}
