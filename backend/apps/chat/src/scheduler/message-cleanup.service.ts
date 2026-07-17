import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, LessThan, In } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageCleanupService {
  private readonly logger = new Logger(MessageCleanupService.name);
  private readonly orderChatExpirationDays: number;
  private readonly agencyChatExpirationDays: number;

  constructor(
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private readonly configService: ConfigService,
  ) {
    this.orderChatExpirationDays = Number(
      this.configService.get('ORDER_CHAT_EXPIRATION_DAYS', 7),
    );
    this.agencyChatExpirationDays = Number(
      this.configService.get('AGENCY_CHAT_EXPIRATION_DAYS', 7),
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredMessages() {
    this.logger.log('Running message cleanup job...');

    const now = new Date();
    
    const expiredConversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.expiresAt <= :now', { now })
      .orWhere('conversation.customExpiration <= :now', { now })
      .getMany();

    const conversationIds = expiredConversations.map(c => c.id);

    if (conversationIds.length > 0) {
      const result = await this.messageRepository.delete({ conversationId: In(conversationIds) });
      this.logger.log(`Deleted ${result.affected} messages from ${conversationIds.length} expired conversations`);
    }

    const orderChatCutoff = new Date();
    orderChatCutoff.setDate(orderChatCutoff.getDate() - this.orderChatExpirationDays);

    const oldOrderChats = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.type = :type', { type: 'order' })
      .andWhere('conversation.createdAt < :cutoff', { cutoff: orderChatCutoff })
      .getMany();

    const oldOrderChatIds = oldOrderChats.map(c => c.id);

    if (oldOrderChatIds.length > 0) {
      const result = await this.messageRepository.delete({ conversationId: In(oldOrderChatIds) });
      this.logger.log(`Deleted ${result.affected} messages from ${oldOrderChatIds.length} old order chats`);
    }

    const agencyChatCutoff = new Date();
    agencyChatCutoff.setDate(agencyChatCutoff.getDate() - this.agencyChatExpirationDays);

    const oldAgencyChats = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.type = :type', { type: 'agency' })
      .andWhere('conversation.createdAt < :cutoff', { cutoff: agencyChatCutoff })
      .getMany();

    const oldAgencyChatIds = oldAgencyChats.map(c => c.id);

    if (oldAgencyChatIds.length > 0) {
      const result = await this.messageRepository.delete({ conversationId: In(oldAgencyChatIds) });
      this.logger.log(`Deleted ${result.affected} messages from ${oldAgencyChatIds.length} old agency chats`);
    }
  }
}



