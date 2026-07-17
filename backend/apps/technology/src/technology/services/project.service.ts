import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Project, ProjectStatus } from '../entities/project.entity';
import { ProjectParticipant, ParticipantRole } from '../entities/project-participant.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectQueryDto } from '../dto/project-query.dto';
import { ProjectProposal } from '../entities/project-proposal.entity';
import { ApplyProjectDto } from '../dto/apply-project.dto';
import { ProposalQueryDto } from '../dto/proposal-query.dto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectParticipant)
    private readonly participantRepository: Repository<ProjectParticipant>,
    @InjectRepository(ProjectProposal)
    private readonly proposalRepository: Repository<ProjectProposal>,
  ) {}

  async create(createDto: CreateProjectDto, createdBy: string): Promise<Project> {
    const project = this.projectRepository.create({
      title: createDto.title,
      description: createDto.description,
      startDate: createDto.startDate ? new Date(createDto.startDate) : null,
      endDate: createDto.endDate ? new Date(createDto.endDate) : null,
      status: createDto.status || ProjectStatus.DRAFT,
      price: createDto.price || 0,
      currency: createDto.currency || 'USD',
      category: createDto.category,
      paymentType: createDto.paymentType,
      skills: createDto.skills,
      createdBy,
      updatedBy: createdBy,
    });

    const savedProject = await this.projectRepository.save(project);

    // Add creator as admin participant
    const participant = this.participantRepository.create({
      projectId: savedProject.id,
      userId: createdBy,
      userName: createdBy, // TODO: get actual name from user service
      role: ParticipantRole.ADMIN,
      accountType: 'user', // TODO: get from user
    });
    await this.participantRepository.save(participant);

    return savedProject;
  }

  async findAll(query: ProjectQueryDto, userId?: string): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      createdBy,
      price,
      category,
      paymentType,
      skills,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (createdBy) where.createdBy = createdBy;
    if (search) where.title = Like(`%${search}%`);

    if (price) where.price = price;
    if (category) where.category = category;
    if (paymentType) where.paymentType = paymentType;

    // Handle skills (simple-array search)
    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      // For simple-array, we use Raw or individual Like queries.
      // Since 'where' can be an array of objects for OR, but here we probably want AND or just any match.
      // Usually simple filtering works well with QueryBuilder for complex array matching.
      // For simplicity, if multiple skills are provided, we'll search for projects containing ANY of them.
      if (skillArray.length > 0) {
        // TypeORM doesn't have a built-in for simple-array inclusion in find options easily for multiple values
        // We'll use a more flexible approach if it's just one, or use QueryBuilder for multiple.
      }
    }

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.participants', 'participant');

    if (status) queryBuilder.andWhere('project.status = :status', { status });
    if (createdBy) queryBuilder.andWhere('project.createdBy = :createdBy', { createdBy });
    if (search) queryBuilder.andWhere('project.title LIKE :search', { search: `%${search}%` });
    if (price) queryBuilder.andWhere('project.price = :price', { price });
    if (category) queryBuilder.andWhere('project.category = :category', { category });
    if (paymentType) queryBuilder.andWhere('project.paymentType = :paymentType', { paymentType });

    if (skills) {
      const skillList = skills.split(',').map((s) => s.trim());
      skillList.forEach((skill, index) => {
        queryBuilder.andWhere(`project.skills LIKE :skill${index}`, {
          [`skill${index}`]: `%${skill}%`,
        });
      });
    }

    // If user provided, only show projects they participate in
    if (userId) {
      const participantProjects = await this.participantRepository.find({
        where: { userId },
        select: ['projectId'],
      });
      const projectIds = participantProjects.map((p) => p.projectId);
      if (projectIds.length > 0) {
        queryBuilder.andWhere('project.id IN (:...projectIds)', { projectIds });
      } else {
        // No projects if no participation
        return {
          projects: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        };
      }
    }

    const [projects, total] = await queryBuilder
      .orderBy('project.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(projectId: string, userId?: string): Promise<Project> {
    const where: any = { projectId };

    const project = await this.projectRepository.findOne({
      where,
      relations: ['participants', 'tasks', 'messages'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // If user provided, check participation
    if (userId) {
      const participant = await this.participantRepository.findOne({
        where: { projectId: project.id, userId },
      });
      if (!participant) {
        throw new ForbiddenException('Access denied to this project');
      }
    }

    return project;
  }

  async update(
    projectId: string,
    updateDto: UpdateProjectDto,
    updatedBy: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user is admin or sub-admin
    const participant = await this.participantRepository.findOne({
      where: { projectId: project.id, userId: updatedBy },
    });
    if (
      !participant ||
      ![ParticipantRole.ADMIN, ParticipantRole.SUB_ADMIN].includes(participant.role)
    ) {
      throw new ForbiddenException('Only admins can update project details');
    }

    if (updateDto.title !== undefined) project.title = updateDto.title;
    if (updateDto.description !== undefined) project.description = updateDto.description;
    if (updateDto.status !== undefined) {
      // Validate status transition
      if (!this.canTransitionStatus(project.status, updateDto.status)) {
        throw new BadRequestException(
          `Cannot transition from ${project.status} to ${updateDto.status}`,
        );
      }
      project.status = updateDto.status;
    }
    if (updateDto.startDate !== undefined)
      project.startDate = updateDto.startDate ? new Date(updateDto.startDate) : null;
    if (updateDto.endDate !== undefined)
      project.endDate = updateDto.endDate ? new Date(updateDto.endDate) : null;

    if (updateDto.price !== undefined) project.price = updateDto.price;
    if (updateDto.currency !== undefined) project.currency = updateDto.currency;
    if (updateDto.category !== undefined) project.category = updateDto.category;
    if (updateDto.paymentType !== undefined) project.paymentType = updateDto.paymentType;
    if (updateDto.skills !== undefined) project.skills = updateDto.skills;


    project.updatedBy = updatedBy;

    return this.projectRepository.save(project);
  }

  async remove(projectId: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Only admin can delete
    const participant = await this.participantRepository.findOne({
      where: { projectId: project.id, userId },
    });
    if (!participant || participant.role !== ParticipantRole.ADMIN) {
      throw new ForbiddenException('Only project admin can delete the project');
    }

    await this.projectRepository.remove(project);
  }

  async addParticipant(
    projectId: string,
    userId: string,
    userName: string,
    role: ParticipantRole,
    invitedBy: string,
    accountType: string,
  ): Promise<ProjectParticipant> {
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if inviter has permission
    const inviter = await this.participantRepository.findOne({
      where: { projectId: project.id, userId: invitedBy },
    });
    if (!inviter || ![ParticipantRole.ADMIN, ParticipantRole.SUB_ADMIN].includes(inviter.role)) {
      throw new ForbiddenException('Only admins can add participants');
    }

    // Check if participant already exists
    const existingParticipant = await this.participantRepository.findOne({
      where: { projectId: project.id, userId },
    });
    if (existingParticipant) {
      throw new ConflictException('User is already a participant in this project');
    }

    const participant = this.participantRepository.create({
      projectId: project.id,
      userId,
      userName,
      role,
      accountType,
      invitedBy,
    });

    return this.participantRepository.save(participant);
  }

  async updateParticipantRole(
    projectId: string,
    participantUserId: string,
    newRole: ParticipantRole,
    updatedBy: string,
  ): Promise<ProjectParticipant> {
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Only admin can change roles
    const updater = await this.participantRepository.findOne({
      where: { projectId: project.id, userId: updatedBy },
    });
    if (!updater || updater.role !== ParticipantRole.ADMIN) {
      throw new ForbiddenException('Only project admin can change roles');
    }

    const participant = await this.participantRepository.findOne({
      where: { projectId: project.id, userId: participantUserId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    participant.role = newRole;
    return this.participantRepository.save(participant);
  }

  async applyForProject(
    projectId: string,
    applyDto: ApplyProjectDto,
    userId: string,
  ): Promise<ProjectProposal> {
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if project is active
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Can only apply to active projects');
    }

    // Check if user already applied
    const existingProposal = await this.proposalRepository.findOne({
      where: { projectId: project.id, userId },
    });
    if (existingProposal) {
      throw new ConflictException('You have already submitted a proposal for this project');
    }

    const proposal = this.proposalRepository.create({
      projectId: project.id,
      userId,
      proposal: applyDto.proposal,
      price: applyDto.price,
      currency: applyDto.currency,
      timeline: applyDto.timeline,
      paymentType: applyDto.paymentType,
    });

    return this.proposalRepository.save(proposal);
  }

  async findProposals(projectId: string, query: ProposalQueryDto): Promise<any> {
    const { page = 1, limit = 10, timeline, paymentType } = query;
    const skip = (page - 1) * limit;

    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const queryBuilder = this.proposalRepository
      .createQueryBuilder('proposal')
      .where('proposal.projectId = :projectId', { projectId: project.id });

    if (timeline) {
      queryBuilder.andWhere('proposal.timeline LIKE :timeline', { timeline: `%${timeline}%` });
    }

    if (paymentType) {
      queryBuilder.andWhere('proposal.paymentType = :paymentType', { paymentType });
    }

    const [proposals, total] = await queryBuilder
      .orderBy('proposal.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      proposals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async selectProposal(
    projectId: string,
    proposalId: string,
    adminId: string,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { projectId },
      relations: ['participants'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Only admin can select proposal
    // const admin = project.participants.find(
    //   (p) =>
    //     p.userId === adminId &&
    //     [ParticipantRole.ADMIN, ParticipantRole.SUB_ADMIN].includes(p.role),
    // );
    // if (!admin) {
    //   throw new ForbiddenException('Only project admins can select proposals');
    // }

    const proposal = await this.proposalRepository.findOne({
      where: { proposalId, projectId: project.id },
    });

    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${proposalId} not found for this project`);
    }

    // Update project with proposal details
    project.acceptedProposalId = proposal.id;
    project.price = proposal.price;
    project.currency = proposal.currency;
    project.paymentType = proposal.paymentType;
    // Note: timeline is usually a string like "3 months", we might want to store it in description or a specific field
    // For now we'll just update the core project details and status
    project.status = ProjectStatus.ACTIVE;

    const savedProject = await this.projectRepository.save(project);

    // Add proposer as project member if not already
    const existingParticipant = project.participants.find((p) => p.userId === proposal.userId);
    if (!existingParticipant) {
      const participant = this.participantRepository.create({
        projectId: project.id,
        userId: proposal.userId,
        userName: proposal.userId, // TODO: get real name
        role: ParticipantRole.MEMBER,
        accountType: 'user',
        invitedBy: adminId,
      });
      await this.participantRepository.save(participant);
    }

    return savedProject;
  }

  private canTransitionStatus(from: ProjectStatus, to: ProjectStatus): boolean {
    const transitions: Record<ProjectStatus, ProjectStatus[]> = {
      [ProjectStatus.DRAFT]: [ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED],
      [ProjectStatus.ACTIVE]: [ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED],
      [ProjectStatus.COMPLETED]: [ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED],
      [ProjectStatus.ARCHIVED]: [ProjectStatus.DRAFT], // Allow unarchiving
    };

    return transitions[from]?.includes(to) ?? false;
  }
}
