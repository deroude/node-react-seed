import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1629744330262 implements MigrationInterface {
    name = 'CreateDatabase1629744330262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "text" text NOT NULL, "publish_date" TIMESTAMP WITH TIME ZONE NOT NULL, "slug" character varying NOT NULL, "category" character varying NOT NULL, "authorId" uuid, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "public"."article"`);
        await queryRunner.query(`DROP TABLE "public"."user"`);
    }

}
