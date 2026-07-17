import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ThrottlerModule,
  ThrottlerGuard,
  ThrottlerModuleOptions,
} from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "crypto";
import { EducationModule } from "./education/education.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv =
          configService.get("NODE_ENV") || process.env.NODE_ENV || "production";
        const isProduction = nodeEnv === "production";

        const pinoHttpConfig: any = {
          level: isProduction ? "info" : "debug",
          genReqId: (req) =>
            (req.headers["x-request-id"] as string | undefined) ?? randomUUID(),
        };

        if (!isProduction) {
          try {
            require.resolve("pino-pretty");
            pinoHttpConfig.transport = {
              target: "pino-pretty",
              options: { singleLine: true },
            };
          } catch {
            // pino-pretty not available, use default JSON logging
          }
        }

        return { pinoHttp: pinoHttpConfig };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: Number(configService.get("RATE_LIMIT_TTL") ?? 60),
            limit: Number(configService.get("RATE_LIMIT_MAX") ?? 100),
          },
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = {
          type: "postgres" as const,
          host: configService.get("DB_HOST", "postgres"),
          port: configService.get("DB_PORT", 5432),
          username: configService.get("DB_USERNAME", "user"),
          password: configService.get("DB_PASSWORD", "password"),
          database: configService.get("DB_NAME", "vero2_backend"),
          entities: [],
          synchronize: true,
          logging: true,
          autoLoadEntities: true,
          retryAttempts: 3,
          retryDelay: 3000,
          dropSchema: false,
          cache: false,
        };

        console.log("Database config:", {
          ...config,
          password: "***", // Don't log password
        });

        return config;
      },
      inject: [ConfigService],
    }),
    EducationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
