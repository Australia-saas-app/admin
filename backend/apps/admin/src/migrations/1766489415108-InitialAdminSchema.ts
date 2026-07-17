import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialAdminSchema1766489415108 implements MigrationInterface {
    name = 'InitialAdminSchema1766489415108'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ---------- ENUMS (SAFE CREATION) ----------

        await queryRunner.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_accounttype_enum') THEN
                CREATE TYPE "public"."users_accounttype_enum" AS ENUM ('user', 'agency', 'business');
            END IF;
        END$$;
        `);

        await queryRunner.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_gender_enum') THEN
                CREATE TYPE "public"."users_gender_enum" AS ENUM ('male', 'female', 'other');
            END IF;
        END$$;
        `);

        await queryRunner.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_status_enum') THEN
                CREATE TYPE "public"."users_status_enum"
                AS ENUM ('active', 'pending', 'inactive', 'suspended', 'blocked', 'dormant', 'closed');
            END IF;
        END$$;
        `);

        await queryRunner.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_twofactormethod_enum') THEN
                CREATE TYPE "public"."users_twofactormethod_enum" AS ENUM ('email', 'phone');
            END IF;
        END$$;
        `);

        // ---------- USERS TABLE ----------

        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "users" (
            "id" SERIAL NOT NULL,
            "userId" character varying(20) NOT NULL,
            "accountType" "public"."users_accounttype_enum" NOT NULL DEFAULT 'user',
            "fullName" character varying(255) NOT NULL,
            "email" character varying(255),
            "phone" character varying(50),
            "password" character varying(255) NOT NULL,
            "currency" character varying(10) NOT NULL DEFAULT 'USD',
            "profilePhoto" text,
            "dateOfBirth" date,
            "gender" "public"."users_gender_enum",
            "nationality" character varying(100),
            "passportNumber" character varying(50),
            "permanentAddress" jsonb,
            "governmentId" character varying(100),
            "idDocument" text,
            "status" "public"."users_status_enum" NOT NULL DEFAULT 'active',
            "statusHistory" jsonb,
            "emailVerified" boolean NOT NULL DEFAULT false,
            "phoneVerified" boolean NOT NULL DEFAULT false,
            "twoFactorEnabled" boolean NOT NULL DEFAULT false,
            "twoFactorMethod" "public"."users_twofactormethod_enum",
            "agencyInfo" jsonb,
            "businessInfo" jsonb,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_users_userId" UNIQUE ("userId"),
            CONSTRAINT "UQ_users_email" UNIQUE ("email"),
            CONSTRAINT "UQ_users_phone" UNIQUE ("phone")
        );
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_users_accountType" ON "users" ("accountType")`);

        // ---------- ADMINS ENUM ----------

        await queryRunner.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admins_role_enum') THEN
                CREATE TYPE "public"."admins_role_enum"
                AS ENUM ('super_admin', 'admin', 'sub_admin');
            END IF;
        END$$;
        `);

        // ---------- ADMINS TABLE ----------

        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "admins" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying(255) NOT NULL,
            "password" character varying(255) NOT NULL,
            "fullName" character varying(255) NOT NULL,
            "role" "public"."admins_role_enum" NOT NULL DEFAULT 'admin',
            "permissions" jsonb,
            "lastLogin" TIMESTAMP WITH TIME ZONE,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_admins_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_admins_email" UNIQUE ("email")
        );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`DROP TABLE IF EXISTS "admins"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

        // ⚠️ DO NOT drop enums in down()
        // They may be shared with other services
    }
}
