import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);
  private readonly redis: Redis;
  private readonly onlineUsersKey = 'chat:online:users';
  private readonly adminTimeoutMinutes: number;

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

    this.adminTimeoutMinutes = Number(
      this.configService.get('ADMIN_TIMEOUT_MINUTES', 10),
    );
  }

  async setUserOnline(userId: string, socketId: string): Promise<void> {
    try {
      await this.redis.setex(`chat:user:${userId}`, 300, socketId); // 5 min TTL
      await this.redis.sadd(this.onlineUsersKey, userId);
    } catch (error) {
      this.logger.warn(`Failed to set user online: ${error.message}`);
    }
  }

  async setUserOffline(userId: string): Promise<void> {
    try {
      await this.redis.del(`chat:user:${userId}`);
      await this.redis.srem(this.onlineUsersKey, userId);
    } catch (error) {
      this.logger.warn(`Failed to set user offline: ${error.message}`);
    }
  }

  async isUserOnline(userId: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(`chat:user:${userId}`);
      return exists === 1;
    } catch (error) {
      this.logger.warn(`Failed to check user online status: ${error.message}`);
      return false;
    }
  }

  async getOnlineUsers(): Promise<string[]> {
    try {
      return await this.redis.smembers(this.onlineUsersKey);
    } catch (error) {
      this.logger.warn(`Failed to get online users: ${error.message}`);
      return [];
    }
  }

  async setAdminLastActivity(adminId: string): Promise<void> {
    try {
      await this.redis.setex(
        `chat:admin:activity:${adminId}`,
        this.adminTimeoutMinutes * 60,
        Date.now().toString(),
      );
    } catch (error) {
      this.logger.warn(`Failed to set admin activity: ${error.message}`);
    }
  }

  async getAdminLastActivity(adminId: string): Promise<number | null> {
    try {
      const timestamp = await this.redis.get(`chat:admin:activity:${adminId}`);
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      this.logger.warn(`Failed to get admin activity: ${error.message}`);
      return null;
    }
  }

  async isAdminActive(adminId: string): Promise<boolean> {
    const lastActivity = await this.getAdminLastActivity(adminId);
    if (!lastActivity) return false;

    const now = Date.now();
    const timeoutMs = this.adminTimeoutMinutes * 60 * 1000;
    return (now - lastActivity) < timeoutMs;
  }
}

