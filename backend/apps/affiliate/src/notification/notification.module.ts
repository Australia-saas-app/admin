import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { AffiliateNotification } from '../entities/notification.entity';
import { Affiliate } from '../entities/affiliate.entity';
import { AffiliateProfile } from '../entities/affiliate-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AffiliateNotification,
      Affiliate,
      AffiliateProfile,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}