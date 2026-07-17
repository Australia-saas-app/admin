import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingNotificationColumns1768640040584 implements MigrationInterface {
    name = 'AddMissingNotificationColumns1768640040584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add columns if they do not exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='notifications' AND column_name='title'
                ) THEN
                    ALTER TABLE "notifications"
                    ADD COLUMN "title" character varying NOT NULL DEFAULT 'Notification';
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='notifications' AND column_name='relatedEntity'
                ) THEN
                    ALTER TABLE "notifications"
                    ADD COLUMN "relatedEntity" jsonb;
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='notifications' AND column_name='target'
                ) THEN
                    ALTER TABLE "notifications"
                    ADD COLUMN "target" character varying NOT NULL DEFAULT 'all-admins';
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='notifications' AND column_name='targetAdminId'
                ) THEN
                    ALTER TABLE "notifications"
                    ADD COLUMN "targetAdminId" character varying;
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='notifications' AND column_name='readBy'
                ) THEN
                    ALTER TABLE "notifications"
                    ADD COLUMN "readBy" jsonb NOT NULL DEFAULT '[]'::jsonb;
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='notifications' AND column_name='isRead'
                ) THEN
                    ALTER TABLE "notifications"
                    ADD COLUMN "isRead" boolean NOT NULL DEFAULT false;
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='notifications' AND column_name='priority'
                ) THEN
                    ALTER TABLE "notifications"
                    ADD COLUMN "priority" character varying NOT NULL DEFAULT 'medium';
                END IF;
            END
            $$;
        `);

        // Create indexes if they do not exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_class c
                    JOIN pg_namespace n ON n.oid = c.relnamespace
                    WHERE c.relname = 'IDX_aef1c7aef3725068e5540f8f00'
                ) THEN
                    CREATE INDEX "IDX_aef1c7aef3725068e5540f8f00" ON "notifications" ("type");
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_class c
                    JOIN pg_namespace n ON n.oid = c.relnamespace
                    WHERE c.relname = 'IDX_8ba28344602d583583b9ea1a50'
                ) THEN
                    CREATE INDEX "IDX_8ba28344602d583583b9ea1a50" ON "notifications" ("isRead");
                END IF;

                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_class c
                    JOIN pg_namespace n ON n.oid = c.relnamespace
                    WHERE c.relname = 'IDX_831a5a06f879fb0bebf8965871'
                ) THEN
                    CREATE INDEX "IDX_831a5a06f879fb0bebf8965871" ON "notifications" ("createdAt");
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_831a5a06f879fb0bebf8965871"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_8ba28344602d583583b9ea1a50"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_aef1c7aef3725068e5540f8f00"`);

        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "priority"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "isRead"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "readBy"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "targetAdminId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "target"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "relatedEntity"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "title"`);
    }
}
