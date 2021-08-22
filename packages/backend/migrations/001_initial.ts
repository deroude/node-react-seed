import { Knex } from "knex";

import { Database } from "../src/service/config-service";
import { schemaCreator } from "../src/utils/migration-utils";

export async function up(knex: Knex) {
  const schema = schemaCreator(knex);

  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await knex.raw(`CREATE SCHEMA ${Database.schema};`);

  // User
  await knex.schema.withSchema(Database.schema).createTable("User", (table) => {
    const columns = schema(table);
    columns.primaryUuid();

    table.timestamps(true, true);

    // Fields
    table
      .string("email")
      .unique()
      .notNullable()
      .comment(`The User''s email address.`);

    table.string("firstName").comment(`The User''s first name.`);

    table.string("lastName").comment(`The User''s last name.`);

    table
      .boolean("isActive")
      .comment(`If false, the User is suspended.`)
      .defaultTo(true);
  });
}

export function down(_knex: Knex) {
  throw new Error(
    "Downward migrations are not supported. Restore from backup."
  );
}
