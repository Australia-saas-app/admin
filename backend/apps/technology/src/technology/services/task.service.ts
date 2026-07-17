import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { ProjectTask } from '../entities/project-task.entity';
import { ProjectParticipant, ParticipantRole } from '../entities/project-participant.entity';
import { Project } from '../entities/project.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(ProjectTask)
    private readonly taskRepository: Repository<ProjectTask>,
    @InjectRepository(ProjectParticipant)
    private readonly participantRepository: Repository<ProjectParticipant>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(
    projectId: string,
    createDto: CreateTaskDto,
    createdBy: string,
  ): Promise<ProjectTask> {
    // Find the project
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user can create tasks in this project
    const participant = await this.participantRepository.findOne({
      where: { projectId: project.id, userId: createdBy },
    });
    if (!participant || participant.role === ParticipantRole.VIEWER) {
      throw new ForbiddenException('You do not have permission to create tasks');
    }

    const task = this.taskRepository.create({
      projectId: project.id,
      title: createDto.title,
      description: createDto.description,
      assignedTo: createDto.assignedTo,
      assignedBy: createdBy,
      dueDate: createDto.dueDate ? new Date(createDto.dueDate) : null,
      priority: createDto.priority ?? 0,
      createdBy,
    });

    return this.taskRepository.save(task);
  }

  async findAll(query: TaskQueryDto, userId?: string): Promise<any> {
    const { page = 1, limit = 10, search, status, assignedTo, projectId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;
    if (projectId) where.projectId = parseInt(projectId);
    if (search) where.title = Like(`%${search}%`);

    // If user provided, only show tasks from projects they participate in
    if (userId) {
      const participantProjects = await this.participantRepository.find({
        where: { userId },
        select: ['projectId'],
      });
      const projectIds = participantProjects.map((p) => p.projectId);
      if (projectIds.length > 0) {
        where.projectId = In(projectIds);
      } else {
        // No projects if no participation
        return {
          tasks: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        };
      }
    }

    const [tasks, total] = await this.taskRepository.findAndCount({
      where,
      relations: ['project'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(taskId: number, userId?: string): Promise<ProjectTask> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check project access
    if (userId) {
      const participant = await this.participantRepository.findOne({
        where: { projectId: task.projectId, userId },
      });
      if (!participant) {
        throw new ForbiddenException('Access denied to this task');
      }
    }

    return task;
  }

  async update(taskId: number, updateDto: UpdateTaskDto, updatedBy: string): Promise<ProjectTask> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check permissions: assignee, assigner, or admin/sub-admin
    const participant = await this.participantRepository.findOne({
      where: { projectId: task.projectId, userId: updatedBy },
    });
    if (!participant) {
      throw new ForbiddenException('Access denied');
    }

    const canEdit =
      participant.role !== ParticipantRole.VIEWER &&
      (task.assignedTo === updatedBy ||
        task.assignedBy === updatedBy ||
        [ParticipantRole.ADMIN, ParticipantRole.SUB_ADMIN].includes(participant.role));

    if (!canEdit) {
      throw new ForbiddenException('You cannot edit this task');
    }

    if (updateDto.title !== undefined) task.title = updateDto.title;
    if (updateDto.description !== undefined) task.description = updateDto.description;
    if (updateDto.status !== undefined) task.status = updateDto.status;
    if (updateDto.assignedTo !== undefined) {
      task.assignedTo = updateDto.assignedTo;
      task.assignedBy = updatedBy;
    }
    if (updateDto.dueDate !== undefined)
      task.dueDate = updateDto.dueDate ? new Date(updateDto.dueDate) : null;
    if (updateDto.priority !== undefined) task.priority = updateDto.priority;

    task.updatedAt = new Date();

    return this.taskRepository.save(task);
  }

  async remove(taskId: number, userId: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check permissions
    const participant = await this.participantRepository.findOne({
      where: { projectId: task.projectId, userId },
    });
    if (!participant || participant.role === ParticipantRole.VIEWER) {
      throw new ForbiddenException('You cannot delete this task');
    }

    await this.taskRepository.remove(task);
  }
}
