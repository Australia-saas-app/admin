import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AffiliateNotification } from '../entities/notification.entity';
import { Affiliate } from '../entities/affiliate.entity';
import { AffiliateProfile } from '../entities/affiliate-profile.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(AffiliateNotification) private notificationRepository: Repository<AffiliateNotification>,
    @InjectRepository(Affiliate) private affiliateRepository: Repository<Affiliate>,
    @InjectRepository(AffiliateProfile) private profileRepository: Repository<AffiliateProfile>,
  ) {}

  async getNotifications(affiliateId: string, page: number = 1, limit: number = 20): Promise<any> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const notifications = await this.notificationRepository.find({
      where: { affiliateId: affiliate.id },
      order: { createdAt: 'DESC' },
      skip,
      take: limitNum,
    });

    const total = await this.notificationRepository.count({ where: { affiliateId: affiliate.id } });

    return {
      data: notifications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async updateNotificationPreferences(
    affiliateId: string,
    preferences: { emailNotifications?: boolean; commissionAlerts?: boolean; referralAlerts?: boolean },
  ): Promise<AffiliateProfile> {
    let profile = await this.profileRepository.findOne({ where: { userId: affiliateId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (preferences.emailNotifications !== undefined) {
      profile.emailNotifications = preferences.emailNotifications;
    }
    if (preferences.commissionAlerts !== undefined) {
      profile.commissionAlerts = preferences.commissionAlerts;
    }
    if (preferences.referralAlerts !== undefined) {
      profile.referralAlerts = preferences.referralAlerts;
    }

    return this.profileRepository.save(profile);
  }

  async markNotificationAsRead(notificationId: string, affiliateId: string): Promise<AffiliateNotification> {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId: affiliateId } });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }
    
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId, affiliateId: affiliate.id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }
}