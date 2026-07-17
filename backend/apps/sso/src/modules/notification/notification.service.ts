import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { OtpUtil } from '../../common/utils/otp.util';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpUtil: OtpUtil,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    subject: string,
    message: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      subject,
      message,
    });

    return await this.notificationRepository.save(notification);
  }

  async sendNotification(notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    const user = notification.user;

    try {
      if (notification.type === NotificationType.EMAIL && user.email) {
        await this.sendEmail(user.email, notification.subject, notification.message);
      } else if (notification.type === NotificationType.SMS && user.phone) {
        await this.sendSMS(user.phone, notification.message);
      }
      // PUSH not implemented yet

      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
    } catch (error) {
      notification.status = NotificationStatus.FAILED;
    }

    return await this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    // Assuming we add a readAt field, but for now just return
    return notification;
  }

  private async sendEmail(email: string, subject: string, message: string): Promise<void> {
    // Reuse OTP email sending logic
    // This is a placeholder; implement actual email sending
    console.log(`Sending email to ${email}: ${subject} - ${message}`);
  }

  private async sendSMS(phone: string, message: string): Promise<void> {
    // Reuse OTP SMS sending logic
    console.log(`Sending SMS to ${phone}: ${message}`);
  }
}