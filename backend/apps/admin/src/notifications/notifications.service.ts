import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminNotification } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(AdminNotification)
    private readonly notificationRepository: Repository<AdminNotification>,
  ) {}

  async getNotifications(query: any, adminToken: string) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const qb = this.notificationRepository.createQueryBuilder('notification');

    if (query.type) {
      qb.andWhere('notification.type = :type', { type: query.type });
    }

    if (query.read !== undefined) {
      const isRead = query.read === 'true';
      qb.andWhere('notification.isRead = :isRead', { isRead });
    }

    qb.orderBy('notification.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const [notifications, total] = await qb.getManyAndCount();

    return {
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async markAsRead(notificationId: string, adminToken: string) {
    const notification = await this.notificationRepository.findOne({
      where: { notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    // Assume adminToken contains adminId, but for simplicity, just mark as read
    // TODO: Add adminId to readBy

    await this.notificationRepository.save(notification);

    return {
      success: true,
      message: 'Notification marked as read',
    };
  }

  async markAllAsRead(adminToken: string) {
    await this.notificationRepository.update(
      { isRead: false },
      { isRead: true },
    );

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }
}




