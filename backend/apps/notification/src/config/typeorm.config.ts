import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config({ path: ['.env', '../config/env.example'] });

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_NAME', 'vero2'),
  entities: [
    'src/entities/*.entity.ts',
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});