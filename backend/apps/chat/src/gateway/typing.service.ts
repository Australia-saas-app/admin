import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class TypingService {
  private readonly logger = new Logger(TypingService.name);
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get('REDIS_URL', 'redis://localhost:6379');
    const redisConfig = {
      url: redisUrl,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    };

    this.redis = new Redis(redisConfig);

    // Handle connection errors gracefully
    this.redis.on('error', (err) => {
      this.logger.warn(`Redis connection error: ${err.message}`);
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    // Attempt to connect
    this.redis.connect().catch((err) => {
      this.logger.warn(`Redis initial connection failed: ${err.message}. Service will continue without Redis.`);
    });
  }

  async setTyping(conversationId: string, userId: string): Promise<void> {
    try {
      await this.redis.setex(
        `chat:typing:${conversationId}:${userId}`,
        5, // 5 seconds TTL
        'true',
      );
    } catch (error) {
      this.logger.warn(`Failed to set typing indicator: ${error.message}`);
    }
  }

  async removeTyping(conversationId: string, userId: string): Promise<void> {
    try {
      await this.redis.del(`chat:typing:${conversationId}:${userId}`);
    } catch (error) {
      this.logger.warn(`Failed to remove typing indicator: ${error.message}`);
    }
  }

  async getTypingUsers(conversationId: string): Promise<string[]> {
    try {
      const keys = await this.redis.keys(`chat:typing:${conversationId}:*`);
      return keys.map(key => key.split(':').pop() || '');
    } catch (error) {
      this.logger.warn(`Failed to get typing users: ${error.message}`);
      return [];
    }
  }
}

