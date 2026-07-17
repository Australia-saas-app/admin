import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationSchedule } from '../entities/notification-schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GetSchedulesDto } from './dto/get-schedules.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(NotificationSchedule)
    private readonly scheduleRepository: Repository<NotificationSchedule>,
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto) {
    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      nextRun: this.calculateNextRun(createScheduleDto.cronExpression),
      isActive: createScheduleDto.isActive ?? true,
      channels: createScheduleDto.channels || {
        email: true,
        sms: false,
        push: false,
        inApp: true,
      },
    });

    const savedSchedule = await this.scheduleRepository.save(schedule);

    return {
      success: true,
      data: savedSchedule,
    };
  }

  async getSchedules(query: GetSchedulesDto) {
    const { isActive, notificationType, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const queryBuilder = this.scheduleRepository.createQueryBuilder('schedule');

    // Apply filters
    if (isActive !== undefined) {
      queryBuilder.andWhere('schedule.isActive = :isActive', { isActive });
    }

    if (notificationType) {
      queryBuilder.andWhere('schedule.notificationType = :notificationType', { notificationType });
    }

    // Apply sorting
    queryBuilder.orderBy(`schedule.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [schedules, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data: {
        schedules,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getSchedule(id: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return {
      success: true,
      data: schedule,
    };
  }

  async updateSchedule(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    Object.assign(schedule, updateScheduleDto);

    // Recalculate next run if cron expression changed
    if (updateScheduleDto.cronExpression) {
      schedule.nextRun = this.calculateNextRun(updateScheduleDto.cronExpression);
    }

    const updatedSchedule = await this.scheduleRepository.save(schedule);

    return {
      success: true,
      data: updatedSchedule,
    };
  }

  async deleteSchedule(id: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.scheduleRepository.remove(schedule);

    return {
      success: true,
      message: 'Schedule deleted successfully',
    };
  }

  async toggleSchedule(id: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    schedule.isActive = !schedule.isActive;
    const updatedSchedule = await this.scheduleRepository.save(schedule);

    return {
      success: true,
      data: updatedSchedule,
      message: `Schedule ${schedule.isActive ? 'activated' : 'deactivated'} successfully`,
    };
  }

  async executeSchedule(id: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Here you would implement the actual execution logic
    // This would involve generating notifications and sending them via delivery service

    // Update last run time
    schedule.lastRun = new Date();
    schedule.nextRun = this.calculateNextRun(schedule.cronExpression);
    await this.scheduleRepository.save(schedule);

    return {
      success: true,
      message: 'Schedule executed successfully',
      data: {
        scheduleId: id,
        executedAt: schedule.lastRun,
        nextRun: schedule.nextRun,
      },
    };
  }

  private calculateNextRun(cronExpression: string): Date {
    // Simple implementation - in a real app you'd use a proper cron parser
    // For now, just add some time based on the expression
    const now = new Date();

    // Very basic parsing - you should use a proper cron library
    if (cronExpression.includes('@daily') || cronExpression === '0 0 * * *') {
      now.setDate(now.getDate() + 1);
      now.setHours(0, 0, 0, 0);
    } else if (cronExpression.includes('@weekly') || cronExpression === '0 0 * * 0') {
      now.setDate(now.getDate() + (7 - now.getDay()));
      now.setHours(0, 0, 0, 0);
    } else if (cronExpression.includes('@monthly') || cronExpression === '0 0 1 * *') {
      now.setMonth(now.getMonth() + 1, 1);
      now.setHours(0, 0, 0, 0);
    } else {
      // Default to tomorrow
      now.setDate(now.getDate() + 1);
    }

    return now;
  }

  // Cron job to check and execute due schedules
  @Cron(CronExpression.EVERY_MINUTE)
  async checkDueSchedules() {
    const now = new Date();

    const dueSchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.isActive = :isActive', { isActive: true })
      .andWhere('schedule.nextRun <= :now', { now })
      .getMany();

    for (const schedule of dueSchedules) {
      try {
        await this.executeSchedule(schedule.id);
      } catch (error) {
        console.error(`Failed to execute schedule ${schedule.id}:`, error);
      }
    }
  }
}