import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { NotificationSchedule } from '../entities/notification-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationSchedule]),
    NestScheduleModule,
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}