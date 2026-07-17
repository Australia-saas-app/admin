import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule, RedisModule],
  controllers: [HealthController],
})
export class HealthModule {}

