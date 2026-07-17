import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusHistory, StatusHistoryDocument } from './status-history.schema';

@Injectable()
export class StatusHistoryService {
  constructor(
    @InjectModel(StatusHistory.name)
    private readonly statusHistoryModel: Model<StatusHistoryDocument>,
  ) {}

  async record(params: {
    entityType: string;
    entityId: string;
    fromStatus?: string;
    toStatus: string;
    actorId?: string;
    note?: string;
  }): Promise<StatusHistory> {
    const entry = new this.statusHistoryModel(params);
    return entry.save();
  }

  async getTimeline(entityType: string, entityId: string): Promise<StatusHistory[]> {
    return this.statusHistoryModel
      .find({ entityType, entityId })
      .sort({ createdAt: 1 })
      .lean()
      .exec();
  }
}

