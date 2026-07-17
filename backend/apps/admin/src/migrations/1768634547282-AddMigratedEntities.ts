import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMigratedEntities1768634547282 implements MigrationInterface {
    name = 'AddMigratedEntities1768634547282';

    public async up(queryRunner: QueryRunner): Promise<void> {

        /* ---------------- BLOGS ---------------- */
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "blogs" (
                "blogId" character varying(50) NOT NULL,
                "photo" text,
                "title" character varying(255) NOT NULL,
                "tag" character varying(100),
                "description" text NOT NULL,
                "isVisible" boolean NOT NULL DEFAULT true,
                "displayOrder" integer NOT NULL DEFAULT 0,
                "createdBy" character varying(255) NOT NULL,
                "updatedBy" character varying(255),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_blogs_blogId" PRIMARY KEY ("blogId")
            )
        `);

        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_blogs_blogId" ON "blogs" ("blogId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_blogs_createdAt" ON "blogs" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_blogs_visible_order" ON "blogs" ("isVisible", "displayOrder")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_blogs_search" ON "blogs" ("title", "description", "tag")`);

        /* ---------------- ACTIVITY LOGS ---------------- */
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "activity_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying(255),
                "adminId" character varying(255),
                "action" character varying(100) NOT NULL,
                "service" character varying(100) NOT NULL,
                "details" jsonb,
                "ipAddress" character varying(45),
                "userAgent" text,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_activity_logs_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_activity_logs_action_time" ON "activity_logs" ("action", "timestamp")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_activity_logs_timestamp" ON "activity_logs" ("timestamp")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_activity_logs_service_time" ON "activity_logs" ("service", "timestamp")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_activity_logs_admin_time" ON "activity_logs" ("adminId", "timestamp")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_activity_logs_user_time" ON "activity_logs" ("userId", "timestamp")`);

        /* ---------------- AUDIT TRAILS ---------------- */
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_trails_performedbytype_enum') THEN
                    CREATE TYPE "public"."audit_trails_performedbytype_enum"
                    AS ENUM ('admin', 'user', 'system');
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "audit_trails" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "entityType" character varying(100) NOT NULL,
                "entityId" character varying(255) NOT NULL,
                "action" character varying(100) NOT NULL,
                "performedBy" character varying(255) NOT NULL,
                "performedByType" "public"."audit_trails_performedbytype_enum" NOT NULL DEFAULT 'system',
                "oldValues" jsonb,
                "newValues" jsonb,
                "ipAddress" character varying(45),
                "userAgent" text,
                "metadata" jsonb,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_audit_trails_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_audit_trails_time" ON "audit_trails" ("timestamp")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_audit_trails_action_time" ON "audit_trails" ("action", "timestamp")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_audit_trails_actor_time" ON "audit_trails" ("performedBy", "timestamp")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_audit_trails_entity" ON "audit_trails" ("entityType", "entityId", "timestamp")`);

        /* ---------------- SYSTEM EVENTS ---------------- */
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'system_events_eventtype_enum') THEN
                    CREATE TYPE "public"."system_events_eventtype_enum" AS ENUM (
                        'user_registration','user_login','user_logout','order_created','order_updated',
                        'payment_processed','system_error','system_warning','configuration_change','security_event'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'system_events_severity_enum') THEN
                    CREATE TYPE "public"."system_events_severity_enum"
                    AS ENUM ('low','medium','high','critical');
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "system_events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "eventType" "public"."system_events_eventtype_enum" NOT NULL,
                "severity" "public"."system_events_severity_enum" NOT NULL DEFAULT 'medium',
                "service" character varying(100) NOT NULL,
                "message" text NOT NULL,
                "data" jsonb,
                "userId" character varying(255),
                "adminId" character varying(255),
                "ipAddress" character varying(45),
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "resolved" boolean NOT NULL DEFAULT false,
                "resolvedAt" TIMESTAMP WITH TIME ZONE,
                "resolvedBy" character varying(255),
                CONSTRAINT "PK_system_events_id" PRIMARY KEY ("id")
            )
        `);

        /* ---------------- WALLETS ---------------- */
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "wallets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" integer NOT NULL,
                "balance" numeric(10,2) NOT NULL DEFAULT 0,
                "commissionRate" numeric(5,2) NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_wallets_id" PRIMARY KEY ("id")
            )
        `);

        /* ---------------- FILES ---------------- */
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "files" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "originalName" character varying NOT NULL,
                "filename" character varying NOT NULL,
                "path" character varying NOT NULL,
                "size" bigint NOT NULL,
                "mimetype" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "version" integer NOT NULL DEFAULT 1,
                "uploadedById" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_files_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(): Promise<void> {
        /* no-op (never rollback prod data) */
    }
}
