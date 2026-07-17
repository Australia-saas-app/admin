import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatTopic } from '../entities/chat-topic.entity';
import { PredefinedMessage } from '../entities/predefined-message.entity';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ChatManagementService {
  private readonly logger = new Logger(ChatManagementService.name);

  constructor(
    @InjectRepository(ChatTopic)
    private readonly chatTopicRepository: Repository<ChatTopic>,
    @InjectRepository(PredefinedMessage)
    private readonly predefinedMessageRepository: Repository<PredefinedMessage>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async getChatTopics(adminToken: string) {
    const topics = await this.chatTopicRepository.find({
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: {
        topics,
        total: topics.length,
      },
    };
  }

  async createChatTopic(topicData: any, adminToken: string) {
    const topic = this.chatTopicRepository.create(topicData);
    const savedTopic = await this.chatTopicRepository.save(topic);
    return {
      success: true,
      message: 'Topic created successfully',
      data: savedTopic,
    };
  }

  async getPredefinedMessages(adminToken: string) {
    const messages = await this.predefinedMessageRepository.find({
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: {
        messages,
        total: messages.length,
      },
    };
  }

  async createPredefinedMessage(messageData: any, adminToken: string) {
    const message = this.predefinedMessageRepository.create(messageData);
    const savedMessage = await this.predefinedMessageRepository.save(message);
    return {
      success: true,
      message: 'Message created successfully',
      data: savedMessage,
    };
  }

  // Live Chat Management
  async getLiveChats(adminToken: string, query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const qb = this.conversationRepository.createQueryBuilder('conversation');

    if (query.status) {
      qb.andWhere('conversation.status = :status', { status: query.status });
    }

    qb.orderBy('conversation.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const [chats, total] = await qb.getManyAndCount();

    return {
      success: true,
      data: {
        chats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async blockUser(userId: string, adminToken: string) {
    await this.conversationRepository.update(
      { userId },
      { status: 'blocked' },
    );
    return {
      success: true,
      message: 'User blocked successfully',
    };
  }

  async toggleMessaging(userId: string, enabled: boolean, adminToken: string) {
    await this.conversationRepository.update(
      { userId },
      { messagingEnabled: enabled },
    );
    return {
      success: true,
      message: `Messaging ${enabled ? 'enabled' : 'disabled'}`,
    };
  }

  async toggleCalling(userId: string, enabled: boolean, adminToken: string) {
    await this.conversationRepository.update(
      { userId },
      { callingEnabled: enabled },
    );
    return {
      success: true,
      message: `Calling ${enabled ? 'enabled' : 'disabled'}`,
    };
  }

  async forwardMessage(userId: string, targetAdminId: string, adminToken: string) {
    await this.conversationRepository.update(
      { userId },
      { adminId: targetAdminId },
    );
    return {
      success: true,
      message: 'Message forwarded successfully',
    };
  }

  // Order Chat Management
  async getOrderChats(orderId: string, adminToken: string) {
    const chats = await this.conversationRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: {
        chats,
      },
    };
  }

  async blockUserInOrderChat(orderId: string, userId: string, adminToken: string) {
    await this.conversationRepository.update(
      { userId, orderId },
      { status: 'blocked' },
    );
    return {
      success: true,
      message: 'User blocked in order chat',
    };
  }

  async toggleOrderChatMessaging(orderId: string, userId: string, enabled: boolean, adminToken: string) {
    await this.conversationRepository.update(
      { userId, orderId },
      { messagingEnabled: enabled },
    );
    return {
      success: true,
      message: `Order chat messaging ${enabled ? 'enabled' : 'disabled'}`,
    };
  }

  async toggleOrderChatCalling(orderId: string, userId: string, enabled: boolean, adminToken: string) {
    await this.conversationRepository.update(
      { userId, orderId },
      { callingEnabled: enabled },
    );
    return {
      success: true,
      message: `Order chat calling ${enabled ? 'enabled' : 'disabled'}`,
    };
  }

  // Agency Chat Management
  async getAgencyChats(agencyId: string, adminToken: string) {
    const chats = await this.conversationRepository.find({
      where: { agencyId },
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: {
        chats,
      },
    };
  }

  async blockAgency(agencyId: string, adminToken: string) {
    await this.conversationRepository.update(
      { agencyId },
      { status: 'blocked' },
    );
    return {
      success: true,
      message: 'Agency blocked successfully',
    };
  }

  async toggleAgencyMessaging(agencyId: string, enabled: boolean, adminToken: string) {
    await this.conversationRepository.update(
      { agencyId },
      { messagingEnabled: enabled },
    );
    return {
      success: true,
      message: `Agency messaging ${enabled ? 'enabled' : 'disabled'}`,
    };
  }

  async toggleAgencyCalling(agencyId: string, enabled: boolean, adminToken: string) {
    await this.conversationRepository.update(
      { agencyId },
      { callingEnabled: enabled },
    );
    return {
      success: true,
      message: `Agency calling ${enabled ? 'enabled' : 'disabled'}`,
    };
  }

  async toggleConversationFileUpload(conversationId: string, fileUploadEnabled: boolean, adminToken: string) {
    await this.conversationRepository.update(
      { id: conversationId },
      { fileUploadEnabled },
    );
    return {
      success: true,
      message: `File upload ${fileUploadEnabled ? 'enabled' : 'disabled'}`,
    };
  }
 }



