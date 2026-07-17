import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectService } from './services/project.service';
import { TaskService } from './services/task.service';
import { MessageService } from './services/message.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ApplyProjectDto } from './dto/apply-project.dto';
import { ProposalQueryDto } from './dto/proposal-query.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UnifiedAuthGuard } from '../common/guards/unified-auth.guard';
import { ParticipantRole } from './entities/project-participant.entity';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly messageService: MessageService,
  ) {}

  // ==========================================
  // PROJECT ROUTES
  // ==========================================

  @Post()
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async createProject(@Body() createDto: CreateProjectDto, @Req() req: any) {
    const creatorId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.projectService.create(createDto, creatorId);
  }

  @Get('all')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all projects across the platform' })
  async listAllProjects(@Query() query: ProjectQueryDto) {
    return this.projectService.findAll(query);
  }

  @Get()
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all projects or filtered projects' })
  async getProjects(@Query() query: ProjectQueryDto, @Req() req: any) {
    // If it's a user, they only see projects they participate in
    // If it's an admin, they see all projects
    const userId = req.user?.userId;
    return this.projectService.findAll(query, userId);
  }

  @Get(':projectId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get single project' })
  async getProject(@Param('projectId') projectId: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.projectService.findOne(projectId, userId);
  }

  @Patch(':projectId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update project' })
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() updateDto: UpdateProjectDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.projectService.update(projectId, updateDto, userId);
  }

  @Delete(':projectId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete project' })
  async deleteProject(@Param('projectId') projectId: string, @Req() req: any) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    await this.projectService.remove(projectId, userId);
    return { success: true, message: 'Project deleted successfully' };
  }

  @Post(':projectId/apply')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Apply for project' })
  async applyToProject(
    @Param('projectId') projectId: string,
    @Body() applyDto: ApplyProjectDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.projectService.applyForProject(projectId, applyDto, userId);
  }

  @Get(':projectId/proposals')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get proposals for project' })
  async getProposals(@Param('projectId') projectId: string, @Query() query: ProposalQueryDto) {
    return this.projectService.findProposals(projectId, query);
  }

  @Patch(':projectId/proposals/:proposalId/select')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Select a proposal for project' })
  async selectProposal(
    @Param('projectId') projectId: string,
    @Param('proposalId') proposalId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.projectService.selectProposal(projectId, proposalId, userId);
  }

  // ==========================================
  // PARTICIPANT ROUTES
  // ==========================================

  @Post(':projectId/participants')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add participant to project' })
  async addParticipant(
    @Param('projectId') projectId: string,
    @Body() body: { userId: string; userName: string; role: ParticipantRole; accountType: string },
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.projectService.addParticipant(
      projectId,
      body.userId,
      body.userName,
      body.role,
      userId,
      body.accountType,
    );
  }

  @Patch(':projectId/participants/:userId/role')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update participant role' })
  async updateParticipantRole(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() body: { role: ParticipantRole },
    @Req() req: any,
  ) {
    const updaterId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.projectService.updateParticipantRole(projectId, userId, body.role, updaterId);
  }

  // ==========================================
  // TASK ROUTES
  // ==========================================

  @Post(':projectId/tasks')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create task in project' })
  async createTask(
    @Param('projectId') projectId: string,
    @Body() createDto: CreateTaskDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.taskService.create(projectId, createDto, userId);
  }

  @Get(':projectId/tasks')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get tasks for project' })
  async getTasks(
    @Param('projectId') projectId: string,
    @Query() query: TaskQueryDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    query.projectId = projectId;
    return this.taskService.findAll(query, userId);
  }

  @Get('tasks/:taskId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get single task' })
  async getProjectTask(@Param('taskId') taskId: string, @Req() req: any) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.taskService.findOne(parseInt(taskId), userId);
  }

  @Patch('tasks/:taskId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update task' })
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.taskService.update(parseInt(taskId), updateDto, userId);
  }

  @Delete('tasks/:taskId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete task' })
  async deleteTask(@Param('taskId') taskId: string, @Req() req: any) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    await this.taskService.remove(parseInt(taskId), userId);
    return { success: true, message: 'Task deleted successfully' };
  }

  // ==========================================
  // MESSAGE ROUTES
  // ==========================================

  @Post(':projectId/messages')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Post message to project' })
  async createMessage(
    @Param('projectId') projectId: string,
    @Body() createDto: CreateMessageDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.messageService.create(
      projectId,
      createDto,
      userId,
      userId, // TODO: get actual name
    );
  }

  @Get(':projectId/messages')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get messages for project' })
  async getMessages(@Param('projectId') projectId: string, @Req() req: any) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.messageService.findAll(projectId, userId);
  }

  @Get('messages/:messageId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get single message' })
  async getMessage(@Param('messageId') messageId: string, @Req() req: any) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.messageService.findOne(parseInt(messageId), userId);
  }

  @Patch('messages/:messageId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update message' })
  async updateMessage(
    @Param('messageId') messageId: string,
    @Body() updateDto: UpdateMessageDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    return this.messageService.update(parseInt(messageId), updateDto, userId);
  }

  @Delete('messages/:messageId')
  @UseGuards(UnifiedAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete message' })
  async deleteMessage(@Param('messageId') messageId: string, @Req() req: any) {
    const userId = req.user?.userId || req.admin?.adminId || 'admin';
    await this.messageService.remove(parseInt(messageId), userId);
    return { success: true, message: 'Message deleted successfully' };
  }
}
