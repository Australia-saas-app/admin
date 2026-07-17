import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityLogsController } from "./activity-logs.controller";
import { ActivityLogsService } from "./activity-logs.service";
import { ActivityLog } from "../entities/activity-log.entity";
import { AuditTrail } from "../entities/audit-trail.entity";
import { SystemEvent } from "../entities/system-event.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog, AuditTrail, SystemEvent])],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
