import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { CreateLiveChatDto, CreateOrderChatDto, CreateBusinessChatDto } from './dto/create-conversation.dto';
import { FilterConversationDto } from './dto/filter-conversation.dto';
import { SubmitRatingDto, SetExpirationDto } from './dto/update-conversation.dto';
import { BusinessChatValidator } from '../rules/business-chat-validator';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);
  private readonly orderChatExpirationDays: number;
  private readonly businessChatExpirationDays: number;
  private readonly liveChatOfflineTimeoutMinutes: number;

  constructor(
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    private readonly businessChatValidator: BusinessChatValidator,
    private readonly configService: ConfigService,
  ) {
    this.orderChatExpirationDays = Number(
      this.configService.get('ORDER_CHAT_EXPIRATION_DAYS', 7),
    );
    this.businessChatExpirationDays = Number(
      this.configService.get('BUSINESS_CHAT_EXPIRATION_DAYS', 7),
    );
    this.liveChatOfflineTimeoutMinutes = Number(
      this.configService.get('LIVE_CHAT_OFFLINE_TIMEOUT_MINUTES', 15),
    );
  }

  async createLiveChat(dto: CreateLiveChatDto, userId: string): Promise<Conversation> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.liveChatOfflineTimeoutMinutes);

    const conversation = this.conversationRepository.create({
      type: 'live',
      participants: [userId],
      topic: dto.topic,
      status: 'active',
      expiresAt,
      messageEnabled: dto.messageEnabled ?? true,
      callEnabled: dto.callEnabled ?? false,
      fileUploadEnabled: dto.fileUploadEnabled ?? false,
      voiceUploadEnabled: dto.voiceUploadEnabled ?? false,
    });

    return this.conversationRepository.save(conversation);
  }

  async createOrderChat(dto: CreateOrderChatDto, userId: string, token: string): Promise<Conversation> {
    const existing = await this.conversationRepository.findOne({
      where: {
        type: 'order',
        orderId: dto.orderId,
        status: 'active',
      },
    });

    const userInParticipants = existing?.participants.includes(userId);
    if (existing && userInParticipants) {
      return existing;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.orderChatExpirationDays);

    const conversation = this.conversationRepository.create({
      type: 'order',
      participants: [userId],
      orderId: dto.orderId,
      status: 'active',
      expiresAt,
      messageEnabled: dto.messageEnabled ?? true,
      callEnabled: dto.callEnabled ?? false,
      fileUploadEnabled: dto.fileUploadEnabled ?? false,
      voiceUploadEnabled: dto.voiceUploadEnabled ?? false,
    });

    return this.conversationRepository.save(conversation);
  }

  async createBusinessChat(dto: CreateBusinessChatDto, businessId: string, token: string): Promise<Conversation> {
    await this.businessChatValidator.validateBusinessStatus(businessId, token);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.businessChatExpirationDays);

    const conversation = this.conversationRepository.create({
      type: 'business',
      participants: [businessId],
      topic: dto.topic,
      status: 'active',
      expiresAt,
      messageEnabled: dto.messageEnabled ?? true,
      callEnabled: dto.callEnabled ?? false,
      fileUploadEnabled: dto.fileUploadEnabled ?? false,
      voiceUploadEnabled: dto.voiceUploadEnabled ?? false,
    });

    return this.conversationRepository.save(conversation);
  }

  async getUserConversations(userId: string, type: string, filters: FilterConversationDto): Promise<any> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.conversationRepository.createQueryBuilder('conversation')
      .where('conversation.participants @> :userId', { userId: [userId] });

    if (type) {
      query.andWhere('conversation.type = :type', { type });
    }

    if (filters.status) {
      query.andWhere('conversation.status = :status', { status: filters.status });
    }

    if (filters.orderId) {
      query.andWhere('conversation.orderId = :orderId', { orderId: filters.orderId });
    }

    if (filters.topic) {
      query.andWhere('conversation.topic LIKE :topic', { topic: `%${filters.topic}%` });
    }

    if (filters.startDate) {
      query.andWhere('conversation.createdAt >= :startDate', { startDate: new Date(filters.startDate) });
    }

    if (filters.endDate) {
      query.andWhere('conversation.createdAt <= :endDate', { endDate: new Date(filters.endDate) });
    }

    query.orderBy('conversation.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [conversations, total] = await query.getManyAndCount();

    // Hydrate lastMessage content for each conversation efficiently
    const lastMessageIds = conversations
      .map((c) => c.lastMessage)
      .filter((id): id is string => !!id);

    let messagesMap = new Map<string, Message>();
    if (lastMessageIds.length > 0) {
      const messages = await this.conversationRepository.manager
        .getRepository(Message)
        .find({ where: { id: In(lastMessageIds) } });
      messagesMap = new Map(messages.map((m) => [m.id, m]));
    }

    const hydratedConversations = conversations.map((conv) => {
      const {
        type,
        orderId,
        topic,
        assignedAdminId,
        messageEnabled,
        callEnabled,
        fileUploadEnabled,
        voiceUploadEnabled,
        expiresAt,
        customExpiration,
        rating,
        permittedSubAdmins,
        userLastSeenAt,
        ...rest
      } = conv;

      return {
        ...rest,
        lastMessageDetails: conv.lastMessage ? messagesMap.get(conv.lastMessage) || null : null,
      };
    });

    return {
      data: hydratedConversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getConversationById(id: string, userId: string): Promise<any> {
    const conversation = await this.conversationRepository.findOne({ where: { id } });
    
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.includes(userId)) {
      throw new BadRequestException('Access denied to this conversation');
    }

    const messages = await this.conversationRepository.manager
      .getRepository(Message)
      .find({
        where: { conversationId: id },
        order: { createdAt: 'ASC' },
      });

    return {
      ...conversation,
      messages,
    };
  }

  async getOrderConversation(orderId: string, userId: string): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      where: {
        type: 'order',
        orderId,
      },
    });
  }

  async submitRating(id: string, userId: string, dto: SubmitRatingDto): Promise<Conversation> {
    const conversation = await this.getConversationById(id, userId);
    
    conversation.rating = dto.rating;
    return this.conversationRepository.save(conversation);
  }

  async setExpiration(id: string, dto: SetExpirationDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id } });
    
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (dto.expirationDate) {
      conversation.customExpiration = new Date(dto.expirationDate);
    }

    return this.conversationRepository.save(conversation);
  }

  async closeConversation(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.getConversationById(id, userId);
    conversation.status = 'closed';
    return this.conversationRepository.save(conversation);
  }

  async updateLastMessage(conversationId: string, messageId: string | null, names?: { [userId: string]: string }): Promise<void> {
    const updateData: any = {
      lastMessage: messageId,
      lastActivityAt: new Date(),
    };

    if (names) {
      const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
      if (conversation) {
        updateData.participantNames = { 
          ...(conversation.participantNames || {}), 
          ...names 
        };
      }
    }

    await this.conversationRepository.update(conversationId, updateData);
  }

  async incrementUnreadCount(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (conversation) {
      const unreadCount = { ...conversation.unreadCount };
      unreadCount[userId] = (unreadCount[userId] || 0) + 1;
      await this.conversationRepository.update(conversationId, { unreadCount });
    }
  }

  async resetUnreadCount(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (conversation) {
      const unreadCount = { ...conversation.unreadCount };
      unreadCount[userId] = 0;
      await this.conversationRepository.update(conversationId, { unreadCount });
    }
  }
}
