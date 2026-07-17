import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
} from '../common/status.constants';
import { StatusHistoryService } from '../status-history/status-history.service';
import { AccessControlDto } from './dto/access-control.dto';
import { AssignAdminDto } from './dto/assign-admin.dto';
import { AccessScopeDto } from './dto/access-scope.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DocumentDto } from './dto/document.dto';
import { StatusChangeDto } from './dto/status-change.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {
  VisaApplication,
  VisaApplicationDocument,
} from './schemas/visa-application.schema';

@Injectable()
export class VisaApplicationsService {
  constructor(
    @InjectModel(VisaApplication.name)
    private readonly applicationModel: Model<VisaApplicationDocument>,
    private readonly historyService: StatusHistoryService,
  ) {}

  private readonly transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
    draft: ['submitted'],
    submitted: ['processing', 'approved', 'rejected', 'closed'],
    processing: ['approved', 'rejected', 'closed'],
    approved: ['closed'],
    rejected: ['closed'],
    closed: [],
  };

  private isCommsEnabled(app: VisaApplication, channel: 'chat' | 'call' | 'file' | 'voice') {
    switch (channel) {
      case 'chat':
        return app.chatEnabled;
      case 'call':
        return app.callEnabled;
      case 'file':
        return app.fileEnabled;
      case 'voice':
        return app.voiceEnabled;
      default:
        return false;
    }
  }

  /**
   * Guard-style helper to enforce communication toggles before wiring chat/call/file/voice endpoints.
   * Usage (future): call before performing the action; throw if disabled.
   */
  async assertCommsAllowed(id: string, channel: 'chat' | 'call' | 'file' | 'voice') {
    const app = await this.applicationModel.findById(id).lean().exec();
    if (!app) throw new NotFoundException('Application not found');
    if (!this.isCommsEnabled(app as VisaApplication, channel)) {
      throw new BadRequestException(`${channel} is disabled for this application`);
    }
    return app;
  }

  private assertStatus(status: string): asserts status is ApplicationStatus {
    if (!APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
      throw new BadRequestException('Invalid status');
    }
  }

  async create(dto: CreateApplicationDto): Promise<VisaApplication> {
    if (!dto.userId && !dto.agencyId) {
      throw new BadRequestException('userId or agencyId required');
    }

    const payload: Partial<VisaApplication> = {
      ...dto,
      status: 'draft',
      currency: dto.currency || 'USD',
      passengers: dto.passengers || [],
      documents: dto.documents || [],
      passportExpiry: dto.passportExpiry ? new Date(dto.passportExpiry) : undefined,
      visaStatus: dto.visaStatus,
      visaNumber: dto.visaNumber,
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
      currentAddress: dto.currentAddress || {},
      destinationAddress: dto.destinationAddress || {},
      dates: {
        departure: dto.departureDate ? new Date(dto.departureDate) : undefined,
        return: dto.returnDate ? new Date(dto.returnDate) : undefined,
      },
      amount: { total: dto.budget || 0, paid: 0, due: dto.budget || 0 },
      referenceName: dto.referenceName,
      description: dto.description,
      chatEnabled: dto.chatEnabled ?? true,
      callEnabled: dto.callEnabled ?? true,
      fileEnabled: dto.fileEnabled ?? true,
      voiceEnabled: dto.voiceEnabled ?? true,
    };

    const created = new this.applicationModel(payload);
    const saved = await created.save();
    await this.historyService.record({
      entityType: 'application',
      entityId: saved._id.toString(),
      toStatus: 'draft',
      note: 'Created',
    });
    return saved;
  }

  async findAll(filter: {
    userId?: string;
    agencyId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const q: Record<string, unknown> = {};
    if (filter.userId) q.userId = filter.userId;
    if (filter.agencyId) q.agencyId = filter.agencyId;
    if (filter.status) q.status = filter.status;
    if (filter.startDate || filter.endDate) {
      q.createdAt = {};
      if (filter.startDate) (q.createdAt as any)['$gte'] = new Date(filter.startDate);
      if (filter.endDate) (q.createdAt as any)['$lte'] = new Date(filter.endDate);
    }
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filter.limit) || 20));
    return this.applicationModel
      .find(q)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
  }

  async findOne(id: string) {
    const app = await this.applicationModel.findById(id).lean().exec();
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async update(id: string, dto: UpdateApplicationDto) {
    const existing = await this.applicationModel.findById(id).exec();
    if (!existing) throw new NotFoundException('Application not found');
    if (existing.status !== 'draft') {
      throw new BadRequestException('Only draft applications can be updated');
    }

    if (dto.departureDate || dto.returnDate) {
      existing.dates = {
        departure: dto.departureDate
          ? new Date(dto.departureDate)
          : existing.dates?.departure,
        return: dto.returnDate ? new Date(dto.returnDate) : existing.dates?.return,
      };
    }

    Object.assign(existing, {
      ...dto,
      currency: dto.currency || existing.currency,
      passengers: dto.passengers || existing.passengers,
      metadata: dto.metadata || existing.metadata,
      documents: dto.documents || existing.documents,
      contactPhone: dto.contactPhone ?? existing.contactPhone,
      contactEmail: dto.contactEmail ?? existing.contactEmail,
      currentAddress: dto.currentAddress || existing.currentAddress,
      destinationAddress: dto.destinationAddress || existing.destinationAddress,
      referenceName: dto.referenceName ?? existing.referenceName,
      description: dto.description ?? existing.description,
      passportExpiry: dto.passportExpiry
        ? new Date(dto.passportExpiry)
        : existing.passportExpiry,
      visaStatus: dto.visaStatus ?? existing.visaStatus,
      visaNumber: dto.visaNumber ?? existing.visaNumber,
    });

    await existing.save();
    return existing.toObject();
  }

  async submit(id: string) {
    const app = await this.applicationModel.findById(id).exec();
    if (!app) throw new NotFoundException('Application not found');
    if (app.status !== 'draft') {
      throw new BadRequestException('Only draft applications can be submitted');
    }
    const previous = app.status;
    app.status = 'submitted';
    await app.save();
    await this.historyService.record({
      entityType: 'application',
      entityId: app._id.toString(),
      fromStatus: previous,
      toStatus: 'submitted',
      note: 'Submitted',
    });
    return app.toObject();
  }

  async changeStatus(id: string, dto: StatusChangeDto) {
    this.assertStatus(dto.toStatus);
    const app = await this.applicationModel.findById(id).exec();
    if (!app) throw new NotFoundException('Application not found');
    const previous = app.status;
    const allowed = this.transitions[previous] || [];
    if (!allowed.includes(dto.toStatus as ApplicationStatus)) {
      throw new BadRequestException(`Cannot move from ${previous} to ${dto.toStatus}`);
    }
    app.status = dto.toStatus as ApplicationStatus;

    // toggle chat/call/file/voice availability
    const interactiveStatuses: ApplicationStatus[] = ['draft', 'submitted', 'processing', 'approved'];
    const enable = interactiveStatuses.includes(dto.toStatus as ApplicationStatus);
    app.chatEnabled = enable;
    app.callEnabled = enable;
    app.fileEnabled = enable;
    app.voiceEnabled = enable;

    await app.save();
    await this.historyService.record({
      entityType: 'application',
      entityId: app._id.toString(),
      fromStatus: previous,
      toStatus: dto.toStatus,
      actorId: dto.actorId,
      note: dto.note,
    });
    return app.toObject();
  }

  async timeline(id: string) {
    return this.historyService.getTimeline('application', id);
  }

  async updateAccess(id: string, dto: AccessControlDto) {
    const app = await this.applicationModel.findById(id).exec();
    if (!app) throw new NotFoundException('Application not found');
    Object.assign(app, {
      chatEnabled: dto.chatEnabled ?? app.chatEnabled,
      callEnabled: dto.callEnabled ?? app.callEnabled,
      fileEnabled: dto.fileEnabled ?? app.fileEnabled,
      voiceEnabled: dto.voiceEnabled ?? app.voiceEnabled,
    });
    await app.save();
    return app.toObject();
  }

  async setAccessScope(id: string, dto: AccessScopeDto) {
    const app = await this.applicationModel.findById(id).exec();
    if (!app) throw new NotFoundException('Application not found');
    app.accessScope = dto.accessScope;
    await app.save();
    return app.toObject();
  }

  async addDocument(id: string, dto: DocumentDto) {
    const app = await this.applicationModel.findById(id).exec();
    if (!app) throw new NotFoundException('Application not found');
    app.documents = app.documents || [];
    app.documents.push(dto.key);
    await app.save();
    return app.toObject();
  }

  async assignAdmin(id: string, dto: AssignAdminDto) {
    const app = await this.applicationModel.findById(id).exec();
    if (!app) throw new NotFoundException('Application not found');
    app.assignedAdminId = dto.adminId;
    await app.save();
    await this.historyService.record({
      entityType: 'application',
      entityId: app._id.toString(),
      toStatus: app.status,
      actorId: dto.adminId,
      note: 'Admin assigned',
    });
    return app.toObject();
  }

  async stats(filter: { userId?: string; agencyId?: string }) {
    const q: Record<string, unknown> = {};
    if (filter.userId) q.userId = filter.userId;
    if (filter.agencyId) q.agencyId = filter.agencyId;
    const pipeline = [
      { $match: q },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ];
    return this.applicationModel.aggregate(pipeline).exec();
  }
}

