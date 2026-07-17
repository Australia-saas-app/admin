import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../gateway/presence.service';

@Injectable()
export class LiveChatOfflineCleanupService {
  private readonly logger = new Logger(LiveChatOfflineCleanupService.name);
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

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupOfflineLiveChatMessages() {
    this.logger.log('Checking for offline live chat messages to cleanup...');

    const liveChats = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.type = :type', { type: 'live' })
      .andWhere('conversation.status = :status', { status: 'active' })
      .getMany();

    const now = new Date();

    for (const conversation of liveChats) {
      if (!conversation.userLastSeenAt) continue;

      for (const [userId, lastSeen] of Object.entries(conversation.userLastSeenAt)) {
        const isOnline = await this.presenceService.isUserOnline(userId);
        
        if (isOnline) {
          continue;
        }

        const lastSeenDate = new Date(lastSeen);
        const minutesOffline = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);

        if (minutesOffline >= this.liveChatOfflineTimeoutMinutes) {
          const result = await this.messageRepository.delete({ conversationId: conversation.id });

          this.logger.log(
            `Deleted ${result.affected} messages for live chat ${conversation.id} - user ${userId} offline for ${minutesOffline.toFixed(1)} minutes`
          );
        }
      }
    }
  }
}

