import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFilesTable1768640159282 implements MigrationInterface {
    name = 'CreateFilesTable1768640159282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create table if it does not exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_name='files'
                ) THEN
                    CREATE TABLE "files" (
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
                        CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id")
                    );
                END IF;
            END
            $$;
        `);

        // Add foreign key if it does not exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu 
                      ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name='files' AND tc.constraint_type='FOREIGN KEY' AND kcu.column_name='uploadedById'
                ) THEN
                    ALTER TABLE "files"
                    ADD CONSTRAINT "FK_a525d85f0ac59aa9a971825e1af"
                    FOREIGN KEY ("uploadedById") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key if exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu 
                      ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name='files' AND tc.constraint_type='FOREIGN KEY' AND kcu.column_name='uploadedById'
                ) THEN
                    ALTER TABLE "files" DROP CONSTRAINT "FK_a525d85f0ac59aa9a971825e1af";
                END IF;
            END
            $$;
        `);

        // Drop table if exists
        await queryRunner.query(`DROP TABLE IF EXISTS "files"`);
    }
}
