import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  async check() {
    const mongoState = this.connection.readyState === 1 ? 'up' : 'down';
    return {
      status: 'ok',
      mongo: mongoState,
    };
  }
}

