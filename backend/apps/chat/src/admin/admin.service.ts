import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, Like, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { ChatAssignment } from '../entities/chat-assignment.entity';
import { PredefinedMessage } from '../entities/predefined-message.entity';
import {
  AssignConversationDto,
  ForwardConversationDto,
  BlockUserDto,
  ToggleFeatureDto,
} from './dto/assign-conversation.dto';
import { CreatePredefinedMessageDto, UpdatePredefinedMessageDto } from './dto/predefined-message.dto';
import { SetExpirationDto } from '../conversation/dto/update-conversation.dto';
import { FilterConversationDto } from '../conversation/dto/filter-conversation.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    @InjectRepository(ChatAssignment) private assignmentRepository: Repository<ChatAssignment>,
    @InjectRepository(PredefinedMessage) private predefinedMessageRepository: Repository<PredefinedMessage>,
  ) {}

  async getAllConversations(filters: FilterConversationDto, adminId: string, token: string): Promise<any> {
    const query = this.conversationRepository.createQueryBuilder('conversation');

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

    const page = filters.page || 1;
    const limit = filters.limit || 20;

    query.orderBy('conversation.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [conversations, total] = await query.getManyAndCount();

    return {
      data: conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUnassignedConversations(token: string): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.status = :status', { status: 'active' })
      .andWhere('conversation.assignedAdminId IS NULL')
      .getMany();
  }

  async getAssignedConversations(adminId: string): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.assignedAdminId = :adminId', { adminId })
      .andWhere('conversation.status = :status', { status: 'active' })
      .getMany();
  }

  async assignConversation(conversationId: string, dto: AssignConversationDto, adminId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.assignedAdminId = dto.adminId;
    await this.conversationRepository.save(conversation);

    const assignment = this.assignmentRepository.create({
      conversationId,
      adminId: dto.adminId,
      assignedAt: new Date(),
      reason: 'manual',
    });
    await this.assignmentRepository.save(assignment);

    return conversation;
  }

  async unassignConversation(conversationId: string, adminId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.assignedAdminId = undefined;
    await this.conversationRepository.save(conversation);

    await this.assignmentRepository
      .createQueryBuilder()
      .update(ChatAssignment)
      .set({ unassignedAt: new Date(), reason: 'manual' })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('adminId = :adminId', { adminId })
      .execute();

    return conversation;
  }

  async forwardConversation(conversationId: string, dto: ForwardConversationDto, adminId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.unassignConversation(conversationId, adminId);

    return this.assignConversation(conversationId, { adminId: dto.targetAdminId }, adminId);
  }

  async blockUser(conversationId: string, dto: BlockUserDto, adminId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.status = 'blocked';
    conversation.blockedBy = adminId;
    conversation.messageEnabled = false;
    conversation.callEnabled = false;
    conversation.fileUploadEnabled = false;
    conversation.voiceUploadEnabled = false;

    return this.conversationRepository.save(conversation);
  }

  async unblockUser(conversationId: string, adminId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.status = 'active';
    conversation.blockedBy = undefined;
    conversation.messageEnabled = true;

    return this.conversationRepository.save(conversation);
  }

  async toggleMessage(conversationId: string, dto: ToggleFeatureDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.messageEnabled = dto.enabled;
    return this.conversationRepository.save(conversation);
  }

  async toggleCall(conversationId: string, dto: ToggleFeatureDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.callEnabled = dto.enabled;
    return this.conversationRepository.save(conversation);
  }

  async toggleFileUpload(conversationId: string, dto: ToggleFeatureDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.fileUploadEnabled = dto.enabled;
    return this.conversationRepository.save(conversation);
  }

  async toggleVoiceUpload(conversationId: string, dto: ToggleFeatureDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.voiceUploadEnabled = dto.enabled;
    return this.conversationRepository.save(conversation);
  }

  async setExpiration(conversationId: string, dto: SetExpirationDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (dto.expirationDate) {
      conversation.customExpiration = new Date(dto.expirationDate);
    }

    return this.conversationRepository.save(conversation);
  }

  async createPredefinedMessage(adminId: string, dto: CreatePredefinedMessageDto): Promise<PredefinedMessage> {
    const message = this.predefinedMessageRepository.create({
      adminId,
      ...dto,
    });

    return this.predefinedMessageRepository.save(message);
  }

  async getPredefinedMessages(adminId: string): Promise<PredefinedMessage[]> {
    return this.predefinedMessageRepository.find({ where: { adminId } });
  }

  async updatePredefinedMessage(id: string, adminId: string, dto: UpdatePredefinedMessageDto): Promise<PredefinedMessage> {
    const message = await this.predefinedMessageRepository.findOne({ where: { id, adminId } });
    if (!message) {
      throw new NotFoundException('Predefined message not found');
    }

    Object.assign(message, dto);
    return this.predefinedMessageRepository.save(message);
  }

  async deletePredefinedMessage(id: string, adminId: string): Promise<void> {
    const result = await this.predefinedMessageRepository.delete({ id, adminId });
    if (result.affected === 0) {
      throw new NotFoundException('Predefined message not found');
    }
  }

  async getAssignedUsers(adminId: string): Promise<any[]> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.assignedAdminId = :adminId', { adminId })
      .andWhere('conversation.status = :status', { status: 'active' })
      .getMany();

    const userIds = new Set<string>();
    conversations.forEach(conv => {
      conv.participants.forEach(pid => {
        if (pid !== adminId) {
          userIds.add(pid);
        }
      });
    });

    return Array.from(userIds).map(userId => ({
      userId,
      conversationCount: conversations.filter(c => c.participants.includes(userId)).length,
    }));
  }

  async assignTopicToSubAdmins(topic: string, subAdminIds: string[], adminId: string): Promise<void> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.topic = :topic', { topic })
      .andWhere('conversation.type = :type', { type: 'live' })
      .getMany();

    for (const conversation of conversations) {
      const currentPermitted = conversation.permittedSubAdmins || [];
      const newPermitted = [...new Set([...currentPermitted, ...subAdminIds])];
      await this.conversationRepository.update(conversation.id, { permittedSubAdmins: newPermitted });
    }
  }

  async getStats(): Promise<any> {
    const [total, active, closed, blocked, assigned, unassigned] = await Promise.all([
      this.conversationRepository.count(),
      this.conversationRepository.count({ where: { status: 'active' } }),
      this.conversationRepository.count({ where: { status: 'closed' } }),
      this.conversationRepository.count({ where: { status: 'blocked' } }),
      this.conversationRepository
        .createQueryBuilder('conversation')
        .where('conversation.assignedAdminId IS NOT NULL')
        .getCount(),
      this.conversationRepository
        .createQueryBuilder('conversation')
        .where('conversation.assignedAdminId IS NULL')
        .andWhere('conversation.status = :status', { status: 'active' })
        .getCount(),
    ]);

    return {
      total,
      active,
      closed,
      blocked,
      assigned,
      unassigned,
    };
  }
}

