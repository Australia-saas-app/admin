import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';

@Injectable()
export class ChatRulesService {
  private readonly logger = new Logger(ChatRulesService.name);
  private readonly adminTimeoutMinutes: number;
  private readonly liveChatOfflineTimeoutMinutes: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {
    this.adminTimeoutMinutes = Number(
      this.configService.get('ADMIN_TIMEOUT_MINUTES', 10),
    );
    this.liveChatOfflineTimeoutMinutes = Number(
      this.configService.get('LIVE_CHAT_OFFLINE_TIMEOUT_MINUTES', 15),
    );
  }

  async canUserSendMessage(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new ForbiddenException('Conversation not found');
    }

    if (conversation.status === 'blocked') {
      throw new ForbiddenException('Conversation is blocked');
    }

    if (!conversation.messageEnabled) {
      throw new ForbiddenException('Messaging is disabled for this conversation');
    }

    return true;
  }

  async canUserUploadFile(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new ForbiddenException('Conversation not found');
    }

    if (!conversation.fileUploadEnabled) {
      throw new ForbiddenException('File upload is disabled for this conversation');
    }

    const skipVerification = this.configService.get<string>('SKIP_JWT_VERIFICATION', 'false').toLowerCase() === 'true';
    if (!skipVerification) {
      const hasAdminReply = await this.messageRepository
        .createQueryBuilder('message')
        .where('message.conversationId = :conversationId', { conversationId })
        .andWhere('message.senderType IN (:...senderTypes)', { senderTypes: ['admin', 'sub-admin'] })
        .getOne();

      if (!hasAdminReply) {
        throw new ForbiddenException('File upload is only allowed after admin replies');
      }
    }

    return true;
  }

  async canUserUploadVoice(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new ForbiddenException('Conversation not found');
    }

    if (!conversation.voiceUploadEnabled) {
      throw new ForbiddenException('Voice upload is disabled for this conversation');
    }

    const hasAdminReplyToVoice = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.senderType IN (:...senderTypes)', { senderTypes: ['admin', 'sub-admin'] })
      .andWhere('(message.messageType = :voiceType OR message.attachments IS NOT NULL)', { voiceType: 'voice' })
      .getOne();

    if (!hasAdminReplyToVoice) {
      throw new ForbiddenException('Voice upload is only allowed after admin replies to voice message');
    }

    return true;
  }

  async canUserInitiateCall(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new ForbiddenException('Conversation not found');
    }

    if (!conversation.callEnabled) {
      throw new ForbiddenException('Calling is disabled for this conversation');
    }

    const hasAdminReply = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.senderType IN (:...senderTypes)', { senderTypes: ['admin', 'sub-admin'] })
      .getOne();

    if (!hasAdminReply) {
      throw new ForbiddenException('Call can only be initiated after admin replies');
    }

    return true;
  }

  async shouldReassignConversation(conversationId: string): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation || !conversation.assignedAdminId) {
      return false;
    }

    return false;
  }

  async checkAdminTimeout(conversationId: string): Promise<boolean> {
    return false;
  }
}



