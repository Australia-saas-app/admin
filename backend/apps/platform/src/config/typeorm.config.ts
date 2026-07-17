import { Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Injectable()
export class TypeormConfigService {
  constructor(private readonly configService: ConfigService) {}

  createMysqlConfig(database: string): any {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 3306),
      username: this.configService.get('DB_USERNAME', 'root'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: database,
      entities: this.configService.get('DB_NAME', database),
      synchronize: this.configService.get('NODE_ENV') === 'development',
      logging: this.configService.get('NODE_ENV') === 'development',
    };
  }

  createPostgresConfig(database: string): any {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: Number(this.configService.get('DB_PORT', 5432)),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: database,
      entities: this.configService.get('DB_NAME', database),
      synchronize: this.configService.get('NODE_ENV') === 'development',
      logging: this.configService.get('NODE_ENV') === 'development',
    };
  }

  createMongoConfig(database: string): any {
    return {
      uri: this.configService.get('PLATFORM_MONGODB_URI', 'mongodb://localhost:27017/platform_db'),
      dbName: this.configService.get('PLATFORM_MONGODB_DB_NAME', 'platform_db'),
    retryWrites: true,
      retryReads: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
  }
}