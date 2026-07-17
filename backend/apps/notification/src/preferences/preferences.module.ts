import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { UserNotificationPreferences } from '../entities/user-notification-preferences.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserNotificationPreferences])],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule {}