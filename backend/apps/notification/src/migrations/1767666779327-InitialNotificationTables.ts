import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialNotificationTables1767666779327 implements MigrationInterface {
    name = 'InitialNotificationTables1767666779327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notificationId" character varying NOT NULL, "userId" character varying NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "message" text NOT NULL, "data" jsonb, "isRead" boolean NOT NULL DEFAULT false, "readAt" TIMESTAMP, "priority" character varying NOT NULL DEFAULT 'medium', "actions" jsonb NOT NULL DEFAULT '{}', "expiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_569622b0fd6e6ab3661de985a2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_01a2c65f414d36cfe6f5d950fb" ON "user_notifications" ("notificationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb22b968fe41a9f8b219327fde" ON "user_notifications" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a221628b5d9abc6b38c2e64627" ON "user_notifications" ("isRead") `);
        await queryRunner.query(`CREATE INDEX "IDX_01754fa05239e94d9d896fbbc3" ON "user_notifications" ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "user_notification_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "notificationType" character varying NOT NULL, "channels" jsonb NOT NULL DEFAULT '{}', "isEnabled" boolean NOT NULL DEFAULT true, "schedule" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2b30dfc697b16f75a55be54d464" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fc1bb12707451f64b0ebb377fa" ON "user_notification_preferences" ("userId") `);
        await queryRunner.query(`CREATE TABLE "notification_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL, "description" character varying, "subject" character varying NOT NULL, "content" text NOT NULL, "variables" jsonb NOT NULL DEFAULT '[]', "metadata" jsonb NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_76f0fc48b8d057d2ae7f3a2848a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4118447024198c4ac2203a8218" ON "notification_templates" ("name") `);
        await queryRunner.query(`CREATE TABLE "notification_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "notificationType" character varying NOT NULL, "templateData" jsonb NOT NULL, "targetUsers" jsonb NOT NULL DEFAULT '[]', "cronExpression" character varying NOT NULL, "nextRun" TIMESTAMP NOT NULL, "lastRun" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "channels" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a23b6b82168c2cc95d3499cf6a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0e13e2538e05c39249259bac90" ON "notification_schedules" ("name") `);
        await queryRunner.query(`CREATE TABLE "notification_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notificationId" character varying NOT NULL, "userId" character varying NOT NULL, "channel" character varying NOT NULL, "status" character varying NOT NULL, "errorMessage" character varying, "providerResponse" jsonb, "sentAt" TIMESTAMP, "deliveredAt" TIMESTAMP, "readAt" TIMESTAMP, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_19c524e644cdeaebfcffc284871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a1a20a54a95033fa92853a4269" ON "notification_logs" ("notificationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d348e06bb339e4439d60b1480d" ON "notification_logs" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_48259b4e337355e1829598be30" ON "notification_logs" ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "notification_channels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "config" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3bc0cb5b60e8659f5fc859b2af0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_69dd6d53a1bdc77cf870f8713a" ON "notification_channels" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_69dd6d53a1bdc77cf870f8713a"`);
        await queryRunner.query(`DROP TABLE "notification_channels"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48259b4e337355e1829598be30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d348e06bb339e4439d60b1480d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1a20a54a95033fa92853a4269"`);
        await queryRunner.query(`DROP TABLE "notification_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0e13e2538e05c39249259bac90"`);
        await queryRunner.query(`DROP TABLE "notification_schedules"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4118447024198c4ac2203a8218"`);
        await queryRunner.query(`DROP TABLE "notification_templates"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc1bb12707451f64b0ebb377fa"`);
        await queryRunner.query(`DROP TABLE "user_notification_preferences"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01754fa05239e94d9d896fbbc3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a221628b5d9abc6b38c2e64627"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb22b968fe41a9f8b219327fde"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01a2c65f414d36cfe6f5d950fb"`);
        await queryRunner.query(`DROP TABLE "user_notifications"`);
    }

}
