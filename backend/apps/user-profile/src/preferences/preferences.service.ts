import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class PreferencesService {
  private readonly logger = new Logger(PreferencesService.name);

  constructor(
    @InjectRepository(UserPreference)
    private readonly preferenceRepository: Repository<UserPreference>,
  ) {}

  async getPreferences(userId: string): Promise<UserPreference> {
    let preference = await this.preferenceRepository.findOne({
      where: { userId },
    });

    if (!preference) {
      // Create default preferences if not exists
      preference = this.preferenceRepository.create({
        userId,
      });
      preference = await this.preferenceRepository.save(preference);
      this.logger.debug(`Default preferences created for user ${userId}`);
    }

    return preference;
  }

  async updatePreferences(
    userId: string,
    updateDto: UpdatePreferenceDto,
  ): Promise<UserPreference> {
    let preference = await this.preferenceRepository.findOne({
      where: { userId },
    });

    if (!preference) {
      preference = this.preferenceRepository.create({
        userId,
        ...updateDto,
      });
    } else {
      Object.assign(preference, updateDto);
    }

    preference = await this.preferenceRepository.save(preference);
    this.logger.debug(`Preferences updated for user ${userId}`);

    return preference;
  }
}
