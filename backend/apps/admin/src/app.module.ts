import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ThrottlerModule,
  ThrottlerGuard,
  ThrottlerModuleOptions,
} from "@nestjs/throttler";
import { HttpModule } from "@nestjs/axios";
import { APP_GUARD } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "crypto";
import { CommonModule } from "./common/common.module";
import { HealthModule } from "./health/health.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { UserManagementModule } from "./user-management/user-management.module";
import { AdminManagementModule } from "./admin-management/admin-management.module";
import { ActivityLogsModule } from "./activity-logs/activity-logs.module";
import { ChatManagementModule } from "./chat-management/chat-management.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { ReportsModule } from "./reports/reports.module";
import { SystemSettingsModule } from "./system-settings/system-settings.module";
import { AuthModule } from "./auth/auth.module";
import { AgencyManagementModule } from "./agency-management/agency-management.module";
import { OrderManagementModule } from "./order-management/order-management.module";
import { PaymentManagementModule } from "./payment-management/payment-management.module";
import { ServiceManagementModule } from "./service-management/service-management.module";
import { MenuManagementModule } from "./menu-management/menu-management.module";
import { WalletModule } from "./wallet/wallet.module";
import { FileManagementModule } from "./file-management/file-management.module";
import { ActivityLog } from "./entities/activity-log.entity";
import { AuditTrail } from "./entities/audit-trail.entity";
import { SystemEvent } from "./entities/system-event.entity";
import { User } from "./entities/user.entity";
import { Admin } from "./entities/admin.entity";
import { Wallet } from "./entities/wallet.entity";
import { Blog } from "./entities/blog.entity";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { BlogTagEntity } from "./entities/blog-tag.entity";
import { Transaction } from "./entities/transaction.entity";
import { AdminNotification } from "./entities/notification.entity";
import { ChatTopic } from "./entities/chat-topic.entity";
import { PredefinedMessage } from "./entities/predefined-message.entity";
import { Conversation } from "./entities/conversation.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../config/env.example"].filter(Boolean),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        genReqId: (req) =>
          (req.headers["x-request-id"] as string | undefined) ?? randomUUID(),
        transport:
          process.env.NODE_ENV === "production"
            ? undefined
            : { target: "pino-pretty", options: { singleLine: true } },
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: Number(configService.get("RATE_LIMIT_TTL") ?? 60),
            limit: Number(configService.get("RATE_LIMIT_MAX") ?? 500), // 500 req/min for admin
          },
        ],
      }),
    }),
    // PostgreSQL connection for analytics and reporting
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: Number(configService.get("DB_PORT", 5432)),
        username: String(configService.get("DB_USERNAME", "postgres")),
        password: String(configService.get("DB_PASSWORD", "")),
        database: String(configService.get("DB_NAME", "vero2")),
        entities: [
          User,
          Admin,
          Wallet,
          Transaction,
          Blog,
          BlogCategoryEntity,
          BlogTagEntity,
          ActivityLog,
          AuditTrail,
          SystemEvent,
          AdminNotification,
          ChatTopic,
          PredefinedMessage,
          Conversation,
        ],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),

    HttpModule,
    CommonModule,
    HealthModule,
    AnalyticsModule,
    UserManagementModule,
    AdminManagementModule,
    ActivityLogsModule,
    ChatManagementModule,
    NotificationsModule,
    ReportsModule,
    SystemSettingsModule,
    AuthModule,
    AgencyManagementModule,
    OrderManagementModule,
    PaymentManagementModule,
    ServiceManagementModule,
    MenuManagementModule,
    WalletModule,
    FileManagementModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
