import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMessage } from '../entities/project-message.entity';
import { ProjectParticipant, ParticipantRole } from '../entities/project-participant.entity';
import { Project } from '../entities/project.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(ProjectMessage)
    private readonly messageRepository: Repository<ProjectMessage>,
    @InjectRepository(ProjectParticipant)
    private readonly participantRepository: Repository<ProjectParticipant>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(
    projectId: string,
    createDto: CreateMessageDto,
    senderId: string,
    senderName: string,
  ): Promise<ProjectMessage> {
    // Find the project
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user can post messages in this project
    const participant = await this.participantRepository.findOne({
      where: { projectId: project.id, userId: senderId },
    });
    if (!participant || participant.role === ParticipantRole.VIEWER) {
      throw new ForbiddenException('You do not have permission to post messages');
    }

    const message = this.messageRepository.create({
      projectId: project.id,
      senderId,
      senderName,
      messageType: createDto.messageType,
      content: createDto.content,
      isVisible: true,
    });

    return this.messageRepository.save(message);
  }

  async findAll(projectId: string, userId?: string): Promise<ProjectMessage[]> {
    // Find the project
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check project access
    if (userId) {
      const participant = await this.participantRepository.findOne({
        where: { projectId: project.id, userId },
      });
      if (!participant) {
        throw new ForbiddenException('Access denied to this project');
      }
    }

    return this.messageRepository.find({
      where: { projectId: project.id, isVisible: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(messageId: number, userId?: string): Promise<ProjectMessage> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['project'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Check project access
    if (userId) {
      const participant = await this.participantRepository.findOne({
        where: { projectId: message.projectId, userId },
      });
      if (!participant) {
        throw new ForbiddenException('Access denied to this message');
      }
    }

    return message;
  }

  async update(
    messageId: number,
    updateDto: UpdateMessageDto,
    updatedBy: string,
  ): Promise<ProjectMessage> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Only sender or admin can edit
    const participant = await this.participantRepository.findOne({
      where: { projectId: message.projectId, userId: updatedBy },
    });
    if (!participant) {
      throw new ForbiddenException('Access denied');
    }

    const canEdit =
      message.senderId === updatedBy ||
      [ParticipantRole.ADMIN, ParticipantRole.SUB_ADMIN].includes(participant.role);

    if (!canEdit) {
      throw new ForbiddenException('You cannot edit this message');
    }

    if (updateDto.content !== undefined) message.content = updateDto.content;
    if (updateDto.messageType !== undefined) message.messageType = updateDto.messageType;

    message.updatedAt = new Date();

    return this.messageRepository.save(message);
  }

  async remove(messageId: number, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Check permissions
    const participant = await this.participantRepository.findOne({
      where: { projectId: message.projectId, userId },
    });
    if (!participant) {
      throw new ForbiddenException('Access denied');
    }

    const canDelete =
      message.senderId === userId ||
      [ParticipantRole.ADMIN, ParticipantRole.SUB_ADMIN].includes(participant.role);

    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this message');
    }

    // Soft delete by hiding
    message.isVisible = false;
    await this.messageRepository.save(message);
  }
}
