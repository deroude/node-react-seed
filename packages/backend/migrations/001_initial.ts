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

    table.string("status").comment(`INACTIVE or ACTIVE`).defaultTo("INACTIVE");
  });

  // Article
  await knex.schema
    .withSchema(Database.schema)
    .createTable("Article", (table) => {
      const columns = schema(table);
      columns.primaryUuid();

      table.timestamps(true, true);

      // Fields
      table.string("title").notNullable().comment(`The Article title`);

      table.string("slug").comment(`A navigation slug`);

      table.text("text").comment(`The Article content`);
      
      table
        .timestamp("publishDate")
        .comment(`The publish date of the Article`)
        .notNullable()
        .defaultTo(knex.fn.now());

      table
       .string("category")
       .defaultTo("BLOG")

      // Relationships
      columns
        .foreignUuid(
          "author",
          { column: "id", table: `${Database.schema}.User` },
          true
        )
        .comment("The User that created the Article.");
    });
}

export function down(_knex: Knex) {
  throw new Error(
    "Downward migrations are not supported. Restore from backup."
  );
}
