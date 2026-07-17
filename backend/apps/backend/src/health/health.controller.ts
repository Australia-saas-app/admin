import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Inject } from '@nestjs/common';

@Controller()
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
    @Inject('REDIS_CLIENT') private readonly redisClient: any,
  ) {}

  @Get()
  root() {
    return {
      service: 'vero2-backend',
      message: 'Vero2 Backend API is running',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: '/auth',
        api: 'https://vero2-new.onrender.com',
      },
    };
  }

  @Get('health')
  async check() {
    const status = {
      service: 'vero2-backend',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      components: {
        database: {
          status: 'unknown',
          type: 'postgresql',
        },
        redis: {
          status: 'unknown',
        },
      },
    };

    // Check PostgreSQL connection
    try {
      await this.connection.query('SELECT 1');
      status.components.database.status = 'connected';
    } catch (error) {
      status.components.database.status = 'disconnected';
      status.status = 'degraded';
    }

    // Check Redis connection
    try {
      // Check if it's a mock client (doesn't have isOpen or isOpen is false)
      if (this.redisClient && typeof this.redisClient.isOpen !== 'undefined' && !this.redisClient.isOpen) {
        status.components.redis.status = 'disconnected';
        status.status = 'degraded';
      } else {
        const pingResult = await this.redisClient.ping();
        status.components.redis.status =
          pingResult === 'PONG' ? 'connected' : 'disconnected';
        if (status.components.redis.status !== 'connected') {
          status.status = 'degraded';
        }
      }
    } catch (error) {
      status.components.redis.status = 'disconnected';
      status.status = 'degraded';
    }

    const statusCode = status.status === 'healthy' ? 200 : 503;
    return status;
  }
}

