import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';
import { PackagesModule } from './packages/packages.module';
import { VisaApplicationsModule } from './visa-applications/visa-applications.module';
import { BookingsModule } from './bookings/bookings.module';
import { StatusHistoryModule } from './status-history/status-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI', 'mongodb://localhost:27017/visa-travel'),
      }),
    }),
    HealthModule,
    PackagesModule,
    VisaApplicationsModule,
    BookingsModule,
    StatusHistoryModule,
  ],
})
export class AppModule {}

