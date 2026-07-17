import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redis from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

// Create a mock Redis client for when Redis is unavailable
const createMockRedisClient = () => {
  return {
    connect: async () => {},
    disconnect: async () => {},
    setEx: async () => true,
    get: async () => null,
    del: async () => 0,
    ping: async () => 'PONG',
    isOpen: false,
    on: () => {},
  };
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST', 'localhost');
        const redisPort = configService.get('REDIS_PORT', 6379);
        const redisPassword = configService.get('REDIS_PASSWORD', '');
        
        // Check if Redis should be enabled (optional env var)
        const redisEnabled = configService.get('REDIS_ENABLED', 'true').toLowerCase() === 'true';

        if (!redisEnabled) {
          console.log('⚠️  Redis is disabled via REDIS_ENABLED=false, using mock client');
          return createMockRedisClient();
        }

        try {
          const clientConfig: any = {
            socket: {
              host: redisHost,
              port: redisPort,
              family: 4,
              reconnectStrategy: (retries) => {
                if (retries > 10) {
                  console.warn('⚠️  Redis reconnection attempts exceeded, using mock client');
                  return false; // Stop retrying
                }
                return Math.min(retries * 100, 3000); // Exponential backoff
              },
            },
          };

          // Add password if provided
          if (redisPassword) {
            clientConfig.password = redisPassword;
          }

          const client = redis.createClient(clientConfig);

          client.on('connect', () => {
            console.log('✅ Redis connected successfully');
          });

          client.on('error', (err) => {
            console.error('❌ Redis connection error:', err.message);
          });

          client.on('ready', () => {
            console.log('✅ Redis is ready');
          });

          // Try to connect, but don't block startup if it fails
          try {
            await Promise.race([
              client.connect(),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
              ),
            ]);
            return client;
          } catch (error) {
            console.warn('⚠️  Redis connection failed, using mock client:', error.message);
            console.warn('⚠️  OTP features will not work without Redis. Set REDIS_HOST and REDIS_PORT environment variables.');
            await client.quit().catch(() => {}); // Try to clean up
            return createMockRedisClient();
          }
        } catch (error) {
          console.warn('⚠️  Redis initialization failed, using mock client:', error.message);
          return createMockRedisClient();
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}

