import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatusHistoryModule } from '../status-history/status-history.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { VisaApplicationsController } from './visa-applications.controller';
import { VisaApplicationsService } from './visa-applications.service';
import { VisaApplication, VisaApplicationSchema } from './schemas/visa-application.schema';

@Module({
  imports: [
    StatusHistoryModule,
    MongooseModule.forFeature([
      { name: VisaApplication.name, schema: VisaApplicationSchema },
    ]),
  ],
  controllers: [VisaApplicationsController],
  providers: [VisaApplicationsService, JwtAuthGuard],
  exports: [VisaApplicationsService],
})
export class VisaApplicationsModule {}

