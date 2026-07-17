import { DataSource } from "typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../entities/user.entity";
import { Admin } from "../entities/admin.entity";
import { Blog } from "../entities/blog.entity";
import { ActivityLog } from "../entities/activity-log.entity";
import { AuditTrail } from "../entities/audit-trail.entity";
import { SystemEvent } from "../entities/system-event.entity";
import { Wallet } from "../entities/wallet.entity";
import { Transaction } from "../entities/transaction.entity";
import { BlogCategoryEntity } from "../entities/blog-category.entity";
import { BlogTagEntity } from "../entities/blog-tag.entity";
import { AdminNotification } from "../entities/notification.entity";
import { ChatTopic } from "../entities/chat-topic.entity";
import { PredefinedMessage } from "../entities/predefined-message.entity";
import { Conversation } from "../entities/conversation.entity";

ConfigModule.forRoot();

const configService = new ConfigService();

console.log(
  "Admin service using DB:",
  configService.get("DB_NAME", "vero2_admin"),
);

export default new DataSource({
  type: "postgres",
  host: configService.get("DB_HOST", "localhost"),
  port: Number(configService.get("DB_PORT", 5432)),
  username: String(configService.get("DB_USERNAME", "postgres")),
  password: String(configService.get("DB_PASSWORD", "")),
  database: String(configService.get("DB_NAME", "vero2")),
  entities: [
    User,
    Admin,
    Blog,
    BlogCategoryEntity,
    BlogTagEntity,
    ActivityLog,
    AuditTrail,
    SystemEvent,
    Wallet,
    Transaction,
    AdminNotification,
    ChatTopic,
    PredefinedMessage,
    Conversation,
  ],
  migrations: ["src/migrations/*.ts"],
});
