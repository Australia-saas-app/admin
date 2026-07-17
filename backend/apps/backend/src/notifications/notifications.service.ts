import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { GetNotificationsDto } from './dto/get-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getNotifications(query: GetNotificationsDto, adminEmail: string) {
    const { type, isRead, priority, page = 1, limit = 20 } = query;

    const queryBuilder = this.notificationRepository.createQueryBuilder('notification');

    // Filter by type
    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    // Filter by read status - temporarily disabled due to jsonb operator issue
    // TODO: Fix jsonb @> operator
    // if (isRead !== undefined) {
    //   if (isRead) {
    //     queryBuilder.andWhere('notification.readBy @> :adminEmail', {
    //       adminEmail: JSON.stringify([{ adminId: adminEmail }])
    //     });
    //   } else {
    //     queryBuilder.andWhere('NOT (notification.readBy @> :adminEmail)', {
    //       adminEmail: JSON.stringify([{ adminId: adminEmail }])
    //     });
    //   }
    // }

    // Filter by priority
    if (priority) {
      queryBuilder.andWhere('notification.priority = :priority', { priority });
    }

    // Order by createdAt desc
    queryBuilder.orderBy('notification.createdAt', 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [notifications, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async markAsRead(notificationId: string, adminEmail: string) {
    const notification = await this.notificationRepository.findOne({
      where: { notificationId }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // Check if already read by this admin
    const alreadyRead = notification.readBy.some(read => read.adminId === adminEmail);

    if (!alreadyRead) {
      notification.readBy.push({
        adminId: adminEmail,
        readAt: new Date(),
      });
      await this.notificationRepository.save(notification);
    }

    return {
      success: true,
      message: 'Notification marked as read',
    };
  }

  async markAllAsRead(adminEmail: string) {
    // Get all unread notifications
    const unreadNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('NOT (notification.readBy @> :adminEmail)', {
        adminEmail: JSON.stringify([{ adminId: adminEmail }])
      })
      .getMany();

    // Mark them as read
    for (const notification of unreadNotifications) {
      notification.readBy.push({
        adminId: adminEmail,
        readAt: new Date(),
      });
    }

    await this.notificationRepository.save(unreadNotifications);

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }
}