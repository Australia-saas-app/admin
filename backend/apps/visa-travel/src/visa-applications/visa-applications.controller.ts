import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessControlDto } from './dto/access-control.dto';
import { AssignAdminDto } from './dto/assign-admin.dto';
import { AccessScopeDto } from './dto/access-scope.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DocumentDto } from './dto/document.dto';
import { StatusChangeDto } from './dto/status-change.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { VisaApplicationsService } from './visa-applications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request.interface';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class VisaApplicationsController {
  constructor(private readonly visaApplicationsService: VisaApplicationsService) {}

  private ensureUser(req: RequestWithUser, allowed: string[]) {
    const user = req.user;
    if (!user || !allowed.includes(user.accountType)) {
      throw new ForbiddenException(`Only ${allowed.join('/')} accounts can perform this action`);
    }
    return user;
  }

  private ensureOwnership(entity: { userId?: string; agencyId?: string }, user: { userId: string; accountType: string }) {
    if (user.accountType === 'admin') return;
    const isOwner = entity.userId === user.userId || entity.agencyId === user.userId;
    if (!isOwner) {
      throw new ForbiddenException('You do not have access to this application');
    }
  }

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateApplicationDto) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const payload = { ...dto };
    if (user.accountType === 'user') {
      payload.userId = user.userId;
      payload.agencyId = undefined;
    } else if (user.accountType === 'agency') {
      payload.agencyId = user.userId;
      payload.userId = undefined;
    }
    return this.visaApplicationsService.create(payload);
  }

  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query('userId') userId?: string,
    @Query('agencyId') agencyId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const filters = { userId, agencyId, status, startDate, endDate, page, limit };
    if (user.accountType !== 'admin') {
      filters.userId = undefined;
      filters.agencyId = undefined;
      if (user.accountType === 'user') filters.userId = user.userId;
      if (user.accountType === 'agency') filters.agencyId = user.userId;
    }
    return this.visaApplicationsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const app = await this.visaApplicationsService.findOne(id);
    this.ensureOwnership(app, user);
    return app;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateApplicationDto, @Req() req: RequestWithUser) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const app = await this.visaApplicationsService.findOne(id);
    this.ensureOwnership(app, user);
    return this.visaApplicationsService.update(id, dto);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const app = await this.visaApplicationsService.findOne(id);
    this.ensureOwnership(app, user);
    return this.visaApplicationsService.submit(id);
  }

  @Post(':id/status')
  changeStatus(@Param('id') id: string, @Body() dto: StatusChangeDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.visaApplicationsService.changeStatus(id, dto);
  }

  @Get(':id/timeline')
  async timeline(@Param('id') id: string, @Req() req: RequestWithUser) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    const app = await this.visaApplicationsService.findOne(id);
    this.ensureOwnership(app, user);
    return this.visaApplicationsService.timeline(id);
  }

  @Post(':id/access')
  access(@Param('id') id: string, @Body() dto: AccessControlDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.visaApplicationsService.updateAccess(id, dto);
  }

  @Post(':id/access-scope')
  accessScope(@Param('id') id: string, @Body() dto: AccessScopeDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.visaApplicationsService.setAccessScope(id, dto);
  }

  @Post(':id/documents')
  addDocument(@Param('id') id: string, @Body() dto: DocumentDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.visaApplicationsService.addDocument(id, dto);
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignAdminDto, @Req() req: RequestWithUser) {
    this.ensureUser(req, ['admin']);
    return this.visaApplicationsService.assignAdmin(id, dto);
  }

  @Get('stats/summary')
  stats(@Req() req: RequestWithUser, @Query('userId') userId?: string, @Query('agencyId') agencyId?: string) {
    const user = this.ensureUser(req, ['user', 'agency', 'admin']);
    let filters = { userId, agencyId };
    if (user.accountType !== 'admin') {
      filters = { userId: undefined, agencyId: undefined };
      if (user.accountType === 'user') filters.userId = user.userId;
      if (user.accountType === 'agency') filters.agencyId = user.userId;
    }
    return this.visaApplicationsService.stats(filters);
  }
}

