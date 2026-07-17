import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { ScheduleModule } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { AffiliateModule } from './affiliate/affiliate.module';
import { ReferralModule } from './referral/referral.module';
import { CommissionModule } from './commission/commission.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationModule } from './notification/notification.module';
import { WalletModule } from './wallet/wallet.module';
import { LevelModule } from './level/level.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { Affiliate } from './entities/affiliate.entity';
import { AffiliateProfile } from './entities/affiliate-profile.entity';
import { AffiliateLevel } from './entities/affiliate-level.entity';
import { Referral } from './entities/referral.entity';
import { Commission } from './entities/commission.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { Withdrawal } from './entities/withdrawal.entity';
import { AffiliateNotification } from './entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../config/env.example'].filter(Boolean),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV') || process.env.NODE_ENV || 'production';
        const isProduction = nodeEnv === 'production';

        const pinoHttpConfig: any = {
          level: isProduction ? 'info' : 'debug',
          genReqId: (req) =>
            (req.headers['x-request-id'] as string | undefined) ?? randomUUID(),
        };

        if (!isProduction) {
          try {
            require.resolve('pino-pretty');
            pinoHttpConfig.transport = {
              target: 'pino-pretty',
              options: { singleLine: true },
            };
          } catch {
            // fall back to JSON logs
          }
        }

        return { pinoHttp: pinoHttpConfig };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: Number(configService.get('RATE_LIMIT_TTL') ?? 60),
            limit: Number(configService.get('RATE_LIMIT_MAX') ?? 100),
          },
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'affiliate_db'),
        entities: [Affiliate, AffiliateProfile, AffiliateLevel, Referral, Commission, WalletTransaction, Withdrawal, AffiliateNotification],
        // synchronize: false, // Disable auto-sync, use migrations instead
        // logging: configService.get('NODE_ENV') === 'development',
        // migrations: ['src/migrations/*.ts'],
        // migrationsRun: configService.get('NODE_ENV') !== 'production',
        // retryAttempts: 3,
        // retryDelay: 3000,
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AffiliateModule,
    ReferralModule,
    CommissionModule,
    AnalyticsModule,
    NotificationModule,
    WalletModule,
    LevelModule,
    ProfileModule,
    AuthModule,
    AdminModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}