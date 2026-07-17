import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { UserActivitySchema } from './entities/user-activity.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserActivity', schema: UserActivitySchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
