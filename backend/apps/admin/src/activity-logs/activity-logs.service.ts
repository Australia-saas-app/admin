import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { ActivityLog } from "../entities/activity-log.entity";
import { AuditTrail } from "../entities/audit-trail.entity";
import { SystemEvent } from "../entities/system-event.entity";
import { LogQueryDto } from "./dto/log-query.dto";

@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(AuditTrail)
    private readonly auditTrailRepository: Repository<AuditTrail>,
    @InjectRepository(SystemEvent)
    private readonly systemEventRepository: Repository<SystemEvent>,
  ) {}

  async getActivityLogs(query: LogQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.activityLogRepository.createQueryBuilder("log");

    if (query.userId) {
      queryBuilder.andWhere("log.userId = :userId", { userId: query.userId });
    }
    if (query.adminId) {
      queryBuilder.andWhere("log.adminId = :adminId", {
        adminId: query.adminId,
      });
    }
    if (query.service) {
      queryBuilder.andWhere("log.service = :service", {
        service: query.service,
      });
    }
    if (query.action) {
      queryBuilder.andWhere("log.action = :action", { action: query.action });
    }
    if (query.startDate) {
      queryBuilder.andWhere("log.timestamp >= :startDate", {
        startDate: new Date(query.startDate),
      });
    }
    if (query.endDate) {
      queryBuilder.andWhere("log.timestamp <= :endDate", {
        endDate: new Date(query.endDate),
      });
    }

    const [logs, total] = await Promise.all([
      queryBuilder
        .orderBy("log.timestamp", "DESC")
        .skip(skip)
        .take(limit)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getAuditTrails(query: LogQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.auditTrailRepository.createQueryBuilder("trail");

    if (query.userId || query.adminId) {
      queryBuilder.andWhere("trail.performedBy = :performedBy", {
        performedBy: query.userId || query.adminId,
      });
    }
    if (query.service) {
      queryBuilder.andWhere("trail.entityType = :entityType", {
        entityType: query.service,
      });
    }
    if (query.action) {
      queryBuilder.andWhere("trail.action = :action", { action: query.action });
    }
    if (query.startDate) {
      queryBuilder.andWhere("trail.timestamp >= :startDate", {
        startDate: new Date(query.startDate),
      });
    }
    if (query.endDate) {
      queryBuilder.andWhere("trail.timestamp <= :endDate", {
        endDate: new Date(query.endDate),
      });
    }

    const [trails, total] = await Promise.all([
      queryBuilder
        .orderBy("trail.timestamp", "DESC")
        .skip(skip)
        .take(limit)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      success: true,
      data: {
        trails,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getSystemEvents(query: LogQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.systemEventRepository.createQueryBuilder("event");

    if (query.service) {
      queryBuilder.andWhere("event.service = :service", {
        service: query.service,
      });
    }
    if (query.action) {
      queryBuilder.andWhere("event.eventType = :eventType", {
        eventType: query.action,
      });
    }
    if (query.startDate) {
      queryBuilder.andWhere("event.timestamp >= :startDate", {
        startDate: new Date(query.startDate),
      });
    }
    if (query.endDate) {
      queryBuilder.andWhere("event.timestamp <= :endDate", {
        endDate: new Date(query.endDate),
      });
    }

    const [events, total] = await Promise.all([
      queryBuilder
        .orderBy("event.timestamp", "DESC")
        .skip(skip)
        .take(limit)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      success: true,
      data: {
        events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async createActivityLog(logData: Partial<ActivityLog>) {
    const log = this.activityLogRepository.create(logData);
    return this.activityLogRepository.save(log);
  }

  async createAuditTrail(trailData: Partial<AuditTrail>) {
    const trail = this.auditTrailRepository.create(trailData);
    return this.auditTrailRepository.save(trail);
  }

  async createSystemEvent(eventData: Partial<SystemEvent>) {
    const event = this.systemEventRepository.create(eventData);
    return this.systemEventRepository.save(event);
  }
}
