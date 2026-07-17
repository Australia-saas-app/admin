import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationIdColumn1768639944623 implements MigrationInterface {
    name = 'AddNotificationIdColumn1768639944623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD COLUMN "notificationId" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);

        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD CONSTRAINT "UQ_notifications_notificationId" UNIQUE ("notificationId")
        `);

        await queryRunner.query(`CREATE INDEX "IDX_notifications_notificationId" ON "notifications" ("notificationId")`);

        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "title" character varying NOT NULL DEFAULT 'Notification'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "relatedEntity" jsonb`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "target" character varying NOT NULL DEFAULT 'all-admins'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "targetAdminId" character varying`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "readBy" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "isRead" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "priority" character varying NOT NULL DEFAULT 'medium'`);

        await queryRunner.query(`CREATE INDEX "IDX_notifications_type" ON "notifications" ("type")`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_isRead" ON "notifications" ("isRead")`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_createdAt" ON "notifications" ("createdAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_notifications_createdAt"`);
        await queryRunner.query(`DROP INDEX "IDX_notifications_isRead"`);
        await queryRunner.query(`DROP INDEX "IDX_notifications_type"`);
        await queryRunner.query(`DROP INDEX "IDX_notifications_notificationId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "UQ_notifications_notificationId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "priority"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "isRead"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "readBy"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "targetAdminId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "target"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "relatedEntity"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "notificationId"`);
    }
}
