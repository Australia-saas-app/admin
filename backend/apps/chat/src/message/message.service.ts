import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, In } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import {
  CreateTextMessageDto,
  CreateFileMessageDto,
  CreateVoiceMessageDto,
  CreateCallMessageDto,
  UserToBusinessMessageDto,
  BusinessToUserMessageDto,
} from './dto/create-message.dto';
import { FilterMessageDto } from './dto/filter-message.dto';
import { SearchMessageDto, MessageStatsDto, ExportMessageDto } from './dto/message-query.dto';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationOfflineService } from '../conversation/conversation-offline.service';
import { ChatRulesService } from '../rules/chat-rules.service';
import { ProfileClientService } from '../integration/profile-client.service';
import { FileStorageClientService } from '../integration/file-storage-client.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    private readonly conversationService: ConversationService,
    private readonly conversationOfflineService: ConversationOfflineService,
    private readonly chatRulesService: ChatRulesService,
    private readonly profileClientService: ProfileClientService,
    private readonly fileStorageClient: FileStorageClientService,
  ) {}

  private async resolveMessageNames(
    conversationId: string,
    userId: string,
    senderType: string,
    dto: any,
    token?: string,
  ): Promise<void> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) return;

    const receiverId = conversation.participants.find((p) => p !== userId);

    // Always fetch sender name from profile service to pick up any name changes
    const senderName = await this.profileClientService.getProfileName(userId, token, senderType);
    if (senderName) {
      dto.senderName = senderName;
    }

    // Always fetch receiver name from profile service to pick up any name changes
    if (receiverId) {
      let receiverType = 'user';
      if (conversation.type === 'business' || conversation.type === 'agency') {
        receiverType = senderType === 'user' ? (conversation.type === 'agency' ? 'agency' : 'business') : 'user';
      }
      const receiverName = await this.profileClientService.getProfileName(receiverId, token, receiverType);
      if (receiverName) {
        dto.receiverName = receiverName;
      }
    }
  }

  async createTextMessage(
    conversationId: string,
    userId: string,
    senderType: string,
    dto: CreateTextMessageDto,
    token?: string,
    attachments: any[] = [],
  ): Promise<Message> {
    await this.chatRulesService.canUserSendMessage(conversationId, userId);

    await this.resolveMessageNames(conversationId, userId, senderType, dto, token);

    const message = this.messageRepository.create({
      conversationId,
      senderId: userId,
      senderType,
      content: dto.content,
      senderName: dto.senderName,
      receiverName: dto.receiverName,
      messageType: attachments.length > 0 ? 'file' : 'text',
      attachments,
    });

    const savedMessage = await this.messageRepository.save(message);
    
    const names = {};
    if (dto.senderName) names[userId] = dto.senderName;
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    const receiverId = conversation?.participants.find((p) => p !== userId);
    if (dto.receiverName && receiverId) names[receiverId] = dto.receiverName;

    await this.conversationService.updateLastMessage(conversationId, savedMessage.id, names);
    
    if (conversation && conversation.type === 'live') {
      await this.conversationOfflineService.updateUserLastSeen(conversationId, userId);
    }
    
    if (conversation) {
      conversation.participants.forEach(participantId => {
        if (participantId !== userId) {
          this.conversationService.incrementUnreadCount(conversationId, participantId);
        }
      });
    }

    return savedMessage;
  }

  async createFileMessage(
    conversationId: string,
    userId: string,
    senderType: string,
    dto: CreateFileMessageDto,
    token?: string,
  ): Promise<Message> {
    await this.chatRulesService.canUserUploadFile(conversationId, userId);

    await this.resolveMessageNames(conversationId, userId, senderType, dto, token);

    const message = this.messageRepository.create({
      conversationId,
      senderId: userId,
      senderType,
      content: dto.caption,
      senderName: dto.senderName,
      receiverName: dto.receiverName,
      messageType: 'file',
      attachments: [{
        filename: dto.filename,
        url: dto.fileUrl,
        mimeType: dto.mimeType,
        size: dto.size,
      }],
    });

    const savedMessage = await this.messageRepository.save(message);
    
    const names = {};
    if (dto.senderName) names[userId] = dto.senderName;
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    const receiverId = conversation?.participants.find((p) => p !== userId);
    if (dto.receiverName && receiverId) names[receiverId] = dto.receiverName;

    await this.conversationService.updateLastMessage(conversationId, savedMessage.id, names);

    return savedMessage;
  }

  async createVoiceMessage(
    conversationId: string,
    userId: string,
    senderType: string,
    dto: CreateVoiceMessageDto,
    token?: string,
  ): Promise<Message> {
    await this.chatRulesService.canUserUploadVoice(conversationId, userId);

    await this.resolveMessageNames(conversationId, userId, senderType, dto, token);

    const message = this.messageRepository.create({
      conversationId,
      senderId: userId,
      senderType,
      content: dto.caption,
      senderName: dto.senderName,
      receiverName: dto.receiverName,
      messageType: 'voice',
      voiceUrl: dto.voiceUrl,
    });

    const savedMessage = await this.messageRepository.save(message);
    const names = {};
    if (dto.senderName) names[userId] = dto.senderName;
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    const receiverId = conversation?.participants.find((p) => p !== userId);
    if (dto.receiverName && receiverId) names[receiverId] = dto.receiverName;

    await this.conversationService.updateLastMessage(conversationId, savedMessage.id, names);

    return savedMessage;
  }



  async createCallMessage(
    conversationId: string,
    userId: string,
    senderType: string,
    dto: CreateCallMessageDto,
    token?: string,
  ): Promise<Message> {
    await this.chatRulesService.canUserInitiateCall(conversationId, userId);

    await this.resolveMessageNames(conversationId, userId, senderType, dto, token);

    const message = this.messageRepository.create({
      conversationId,
      senderId: userId,
      senderType,
      messageType: 'call',
      callDuration: dto.callDuration,
      content: `Call ${dto.status || 'completed'} - Duration: ${dto.callDuration}s`,
      senderName: (dto as any).senderName,
      receiverName: (dto as any).receiverName,
    });

    const savedMessage = await this.messageRepository.save(message);
    
    const names = {};
    const senderName = (dto as any).senderName;
    const receiverName = (dto as any).receiverName;
    if (senderName) names[userId] = senderName;
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    const receiverId = conversation?.participants.find((p) => p !== userId);
    if (receiverName && receiverId) names[receiverId] = receiverName;

    await this.conversationService.updateLastMessage(conversationId, savedMessage.id, names);

    return savedMessage;
  }


  async getMessages(conversationId: string, filters: FilterMessageDto): Promise<any> {
    const query = this.messageRepository.createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId });

    if (filters.before) {
      query.andWhere('message.createdAt < :before', { before: new Date(filters.before) });
    }

    if (filters.after) {
      query.andWhere('message.createdAt >= :after', { after: new Date(filters.after) });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;

    query.orderBy('message.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [messages, total] = await query.getManyAndCount();

    const conversation = await this.conversationRepository.findOne({ 
      where: { id: conversationId } 
    });

    let lastMessageContent = null;
    if (conversation?.lastMessage) {
      lastMessageContent = await this.messageRepository.findOne({ 
        where: { id: conversation.lastMessage } 
      });
    }

    return {
      data: messages.reverse(),
      lastMessage: lastMessageContent,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const alreadyRead = message.readBy.some(r => r.userId === userId);
    if (!alreadyRead) {
      message.readBy.push({
        userId,
        readAt: new Date(),
      });
      await this.messageRepository.save(message);
    }

    await this.conversationService.resetUnreadCount(message.conversationId, userId);

    return message;
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new NotFoundException('You can only delete your own messages');
    }

    const conversationId = message.conversationId;
    await this.messageRepository.softDelete(messageId);

    // If this was the last message, find the new last message
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (conversation && conversation.lastMessage === messageId) {
      const latestMessage = await this.messageRepository.findOne({
        where: { conversationId },
        order: { createdAt: 'DESC' },
      });
      
      await this.conversationService.updateLastMessage(conversationId, latestMessage?.id || null);
    }
  }

  async searchMessages(conversationId: string, filters: SearchMessageDto): Promise<any> {
    const query = this.messageRepository.createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId });

    if (filters.query) {
      query.andWhere(
        '(message.content ILIKE :query OR message.attachments::text ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;

    query.orderBy('message.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [messages, total] = await query.getManyAndCount();

    return {
      data: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getMessageStats(conversationId: string, filters: MessageStatsDto): Promise<any> {
    const query = this.messageRepository.createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId });

    if (filters.startDate) {
      query.andWhere('message.createdAt >= :startDate', { startDate: new Date(filters.startDate) });
    }

    if (filters.endDate) {
      query.andWhere('message.createdAt <= :endDate', { endDate: new Date(filters.endDate) });
    }

    const messages = await query.getMany();

    const stats = {
      totalMessages: messages.length,
      textMessages: messages.filter(m => m.messageType === 'text').length,
      fileMessages: messages.filter(m => m.messageType === 'file').length,
      voiceMessages: messages.filter(m => m.messageType === 'voice').length,
      callMessages: messages.filter(m => m.messageType === 'call').length,
      totalReadCount: messages.reduce((sum, m) => sum + (m.readBy?.length || 0), 0),
      oldestMessage: messages.length > 0 ? messages[messages.length - 1].createdAt : null,
      newestMessage: messages.length > 0 ? messages[0].createdAt : null,
      averageReadsPerMessage: 0,
    };

    stats.averageReadsPerMessage = stats.totalMessages > 0
      ? stats.totalReadCount / stats.totalMessages
      : 0;

    return stats;
  }

  async exportMessages(conversationId: string, filters: ExportMessageDto): Promise<any> {
    const query = this.messageRepository.createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId });

    if (filters.startDate) {
      query.andWhere('message.createdAt >= :startDate', { startDate: new Date(filters.startDate) });
    }

    if (filters.endDate) {
      query.andWhere('message.createdAt <= :endDate', { endDate: new Date(filters.endDate) });
    }

    query.orderBy('message.createdAt', 'ASC');

    const messages = await query.getMany();

    if (filters.format === 'csv') {
      const csvHeaders = 'ID,Timestamp,Sender ID,Sender Type,Message Type,Content,Read Count\n';
      const csvRows = messages.map((msg) => {
        const content = msg.content ? msg.content.replace(/"/g, '""') : '';
        return `"${msg.id}","${msg.createdAt.toISOString()}","${msg.senderId}","${msg.senderType}","${msg.messageType}","${content}","${msg.readBy.length}"`;
      }).join('\n');

      return csvHeaders + csvRows;
    }

    return {
      conversationId,
      exportDate: new Date().toISOString(),
      totalMessages: messages.length,
      dateRange: {
        startDate: filters.startDate,
        endDate: filters.endDate
      },
      messages: messages.map((msg) => ({
        id: msg.id,
        timestamp: msg.createdAt,
        senderId: msg.senderId,
        senderType: msg.senderType,
        messageType: msg.messageType,
        content: msg.content,
        readBy: msg.readBy,
        attachments: msg.attachments,
        voiceUrl: msg.voiceUrl,
        callDuration: msg.callDuration
      }))
    };
  }

  async findOrCreateBusinessConversation(userId: string, businessId: string): Promise<Conversation> {
    let conversation = await this.conversationRepository.createQueryBuilder('conversation')
      .where('conversation.type IN (:...types)', { types: ['business', 'agency'] })
      .andWhere('conversation.participants @> :userId', { userId: [userId] })
      .andWhere('conversation.participants @> :businessId', { businessId: [businessId] })
      .getOne();

    if (!conversation) {
      conversation = this.conversationRepository.create({
        type: 'business',
        participants: [userId, businessId],
        status: 'active',
        messageEnabled: true,
      });
      conversation = await this.conversationRepository.save(conversation);
    }

    return conversation;
  }

  private async uploadAttachments(files: Express.Multer.File[], token: string): Promise<any[]> {
    const attachments = [];
    const chatFolderId = '3fed4bf3-80f6-44d9-a019-144ccfe29e63';
    
    for (const file of files) {
      const url = await this.fileStorageClient.uploadFile(file, token, chatFolderId);
      if (url) {
        attachments.push({
          filename: file.originalname,
          url,
          mimeType: file.mimetype,
          size: file.size,
        });
      }
    }
    return attachments;
  }

  async sendUserToBusinessMessage(
    userId: string, 
    dto: UserToBusinessMessageDto, 
    token?: string,
    files?: Express.Multer.File[]
  ): Promise<Message> {
    const conversation = await this.findOrCreateBusinessConversation(userId, dto.businessId);
    
    let uploadedAttachments = [];
    if (files && files.length > 0 && token) {
      uploadedAttachments = await this.uploadAttachments(files, token);
    }

    return this.createTextMessage(conversation.id, userId, 'user', { 
      content: dto.content,
      senderName: dto.senderName,
      receiverName: dto.receiverName 
    }, token, uploadedAttachments);
  }

  async sendBusinessToUserMessage(
    businessId: string, 
    dto: BusinessToUserMessageDto, 
    token?: string,
    files?: Express.Multer.File[]
  ): Promise<Message> {
    const conversation = await this.findOrCreateBusinessConversation(dto.userId, businessId);
    
    let uploadedAttachments = [];
    if (files && files.length > 0 && token) {
      uploadedAttachments = await this.uploadAttachments(files, token);
    }

    return this.createTextMessage(conversation.id, businessId, 'business', { 
      content: dto.content,
      senderName: dto.senderName,
      receiverName: dto.receiverName
    }, token, uploadedAttachments);
  }

  async searchChatUsers(userId: string, name: string): Promise<any[]> {
    // 1. Get all conversations the user is in
    const conversations = await this.conversationRepository.createQueryBuilder('conversation')
      .where(':userId = ANY(conversation.participants)', { userId })
      .getMany();

    if (conversations.length === 0) return [];

    const resultsMap = new Map<string, string>();

    // 2. Search in participantsNames already stored in conversations (new robust way)
    for (const conv of conversations) {
      if (conv.participantNames) {
        for (const [pId, pName] of Object.entries(conv.participantNames as { [key: string]: string })) {
          if (pId !== userId && pName.toLowerCase().includes(name.toLowerCase())) {
            resultsMap.set(pId, pName);
          }
        }
      }
    }

    // 3. Fallback: Search for messages (legacy support for old conversations)
    const conversationIds = conversations.map(c => c.id);

    // Search for messages where the other person was the sender
    const senderMatches = await this.messageRepository.createQueryBuilder('message')
      .select('message.senderId', 'userId')
      .addSelect('message.senderName', 'name')
      .where('message.conversationId IN (:...conversationIds)', { conversationIds })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.senderName ILIKE :name', { name: `%${name}%` })
      .distinct(true)
      .getRawMany();

    for (const match of senderMatches) {
      if (!resultsMap.has(match.userId)) {
        resultsMap.set(match.userId, match.name);
      }
    }

    // Search for messages where the other person was the receiver
    const receiverMatches = await this.messageRepository.createQueryBuilder('message')
      .select('message.conversationId', 'convId')
      .addSelect('message.receiverName', 'name')
      .where('message.conversationId IN (:...conversationIds)', { conversationIds })
      .andWhere('message.senderId = :userId', { userId })
      .andWhere('message.receiverName ILIKE :name', { name: `%${name}%` })
      .distinct(true)
      .getRawMany();

    for (const match of receiverMatches) {
      const conv = conversations.find(c => c.id === match.convId);
      if (conv) {
        const otherId = conv.participants.find(p => p !== userId);
        if (otherId && !resultsMap.has(otherId)) {
          resultsMap.set(otherId, match.name);
        }
      }
    }

    return Array.from(resultsMap.entries()).map(([userId, name]) => ({ userId, name }));
  }
}

