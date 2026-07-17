import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const url =
          configService.get<string>('REDIS_URL') ||
          `redis://${configService.get('REDIS_HOST', 'localhost')}:${configService.get('REDIS_PORT', 6379)}`;

        const redisClient = createClient({
          url,
          password: configService.get('REDIS_PASSWORD') || undefined,
        });

        redisClient.on('error', (err) => {
          console.error('Redis Client Error', err);
        });

        await redisClient.connect();
        console.log('✅ Redis (SSO) connected successfully');

        return redisClient;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}


