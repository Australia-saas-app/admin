import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class PresenceService implements OnModuleInit {
  private readonly logger = new Logger(PresenceService.name);
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get('REDIS_URL', 'redis://localhost:6379');
    this.redis = new Redis(redisUrl);
  }

  async getOnlineUsers(): Promise<any> {
    try {
      const users = await this.redis.smembers('online_users');
      const count = users.length;
      this.logger.log(`Getting online users: ${count} users`);
      return {
        online: true,
        users: users,
        count: count,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting online users', error);
      return {
        online: false,
        users: [],
        count: 0,
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  async setUserOnline(userId: string): Promise<void> {
    try {
      await this.redis.sadd('online_users', userId);
      // Set TTL for the user presence (e.g., 5 minutes)
      await this.redis.expire('online_users', 300);
      this.logger.log(`Setting user ${userId} as online`);
    } catch (error) {
      this.logger.error(`Error setting user ${userId} online`, error);
      throw error;
    }
  }

  async setUserOffline(userId: string): Promise<void> {
    try {
      await this.redis.srem('online_users', userId);
      this.logger.log(`Setting user ${userId} as offline`);
    } catch (error) {
      this.logger.error(`Error setting user ${userId} offline`, error);
      throw error;
    }
  }
}