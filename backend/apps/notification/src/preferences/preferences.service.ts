import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotificationPreferences } from '../entities/user-notification-preferences.entity';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserNotificationPreferences)
    private readonly preferencesRepository: Repository<UserNotificationPreferences>,
  ) {}

  async createPreferences(createPreferenceDto: CreatePreferenceDto, userId: string) {
    // Check if preference already exists
    const existingPreference = await this.preferencesRepository.findOne({
      where: { userId, notificationType: createPreferenceDto.notificationType },
    });

    if (existingPreference) {
      throw new Error('Preference already exists for this notification type');
    }

    const preference = this.preferencesRepository.create({
      ...createPreferenceDto,
      userId,
      channels: createPreferenceDto.channels || {
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
      isEnabled: createPreferenceDto.isEnabled ?? true,
    });

    const savedPreference = await this.preferencesRepository.save(preference);

    return {
      success: true,
      data: savedPreference,
    };
  }

  async getUserPreferences(userId: string) {
    const preferences = await this.preferencesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      data: preferences,
    };
  }

  async getPreferencesByType(userId: string, type: string) {
    const preference = await this.preferencesRepository.findOne({
      where: { userId, notificationType: type },
    });

    if (!preference) {
      // Return default preferences if none exist
      return {
        success: true,
        data: {
          userId,
          notificationType: type,
          channels: {
            email: true,
            sms: false,
            push: true,
            inApp: true,
          },
          isEnabled: true,
          schedule: null,
        },
      };
    }

    return {
      success: true,
      data: preference,
    };
  }

  async updatePreferencesByType(
    userId: string,
    type: string,
    updatePreferenceDto: UpdatePreferenceDto,
  ) {
    const preference = await this.preferencesRepository.findOne({
      where: { userId, notificationType: type },
    });

    if (!preference) {
      // Create new preference if it doesn't exist
      return this.createPreferences({ ...updatePreferenceDto, notificationType: type }, userId);
    }

    Object.assign(preference, updatePreferenceDto);
    const updatedPreference = await this.preferencesRepository.save(preference);

    return {
      success: true,
      data: updatedPreference,
    };
  }

  async updateUserPreferences(userId: string, preferences: UpdatePreferenceDto[]) {
    const results = [];

    for (const pref of preferences) {
      const result = await this.updatePreferencesByType(userId, pref.notificationType, pref);
      results.push(result.data);
    }

    return {
      success: true,
      data: results,
      message: 'All preferences updated successfully',
    };
  }

  async deletePreferencesByType(userId: string, type: string) {
    const preference = await this.preferencesRepository.findOne({
      where: { userId, notificationType: type },
    });

    if (!preference) {
      throw new NotFoundException('Preference not found');
    }

    await this.preferencesRepository.remove(preference);

    return {
      success: true,
      message: 'Preference deleted successfully',
    };
  }

  async bulkUpdatePreferences(
    userId: string,
    updates: { type: string; preferences: UpdatePreferenceDto }[],
  ) {
    const results = [];

    for (const update of updates) {
      const result = await this.updatePreferencesByType(
        userId,
        update.type,
        update.preferences,
      );
      results.push(result.data);
    }

    return {
      success: true,
      data: results,
      message: 'Bulk preferences updated successfully',
    };
  }

  async resetUserPreferences(userId: string) {
    // Delete all existing preferences
    await this.preferencesRepository.delete({ userId });

    // Create default preferences for common notification types
    const defaultTypes = [
      'order_updates',
      'promotions',
      'security',
      'account_activity',
      'system_announcements',
    ];

    const defaultPreferences = defaultTypes.map(type => ({
      userId,
      notificationType: type,
      channels: {
        email: true,
        sms: type === 'security', // SMS only for security alerts by default
        push: true,
        inApp: true,
      },
      isEnabled: true,
      schedule: null,
    }));

    const savedPreferences = await this.preferencesRepository.save(defaultPreferences);

    return {
      success: true,
      data: savedPreferences,
      message: 'Preferences reset to defaults successfully',
    };
  }
}