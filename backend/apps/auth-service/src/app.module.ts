import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule, ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { TokenModule } from './modules/token/token.module';
import { SessionModule } from './modules/session/session.module';
import { RedisModule } from './redis/redis.module';
import { AuthorizeModule } from './modules/authorize/authorize.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { User } from './entities/user.entity';
import { OAuthClient } from './entities/oauth-client.entity';
import { OAuthAuthorizationCode } from './entities/oauth-authorization-code.entity';
import { OAuthToken } from './entities/oauth-token.entity';
import { UserSession } from './entities/user-session.entity';
import { MfaSecret } from './entities/mfa-secret.entity';
import { UserConsent } from './entities/user-consent.entity';
import { Role } from './entities/role.entity';
import { Audit } from './entities/audit.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../backend/.env'].filter(Boolean),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV') || process.env.NODE_ENV || 'production';
        const isProduction = nodeEnv === 'production';

        const pinoConfig: any = {
          level: isProduction ? 'info' : 'debug',
          genReqId: (req: any) =>
            (req.headers['x-request-id'] as string | undefined) ?? randomUUID(),
        };

        if (!isProduction) {
          try {
            require.resolve('pino-pretty');
            pinoConfig.transport = { target: 'pino-pretty', options: { singleLine: true } };
          } catch {
            // pino-pretty not available, skip transport (will use default JSON)
          }
        }

        return {
          pinoHttp: pinoConfig,
        };
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
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'vero2_auth'),
        entities: [
          User,
          OAuthClient,
          OAuthAuthorizationCode,
          OAuthToken,
          UserSession,
          MfaSecret,
          UserConsent,
          Role,
          Audit,
        ],
        synchronize:
          configService.get<boolean>('AUTH_SYNCHRONIZE') ??
          configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    DiscoveryModule,
    TokenModule,
    SessionModule,
    AuthorizeModule,
    AuthModule,
    RoleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}