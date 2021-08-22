// https://github.com/bkonkle/node-knex-typescript-example/blob/master/src/utils/MigrationUtils.ts

import { Knex } from "knex";

export const handlePrimaryUuid =
  (knex: Knex, table: Knex.CreateTableBuilder) => (column?: string) =>
    table
      .uuid(column || "id")
      .primary()
      .notNullable()
      .unique()
      .defaultTo(knex.raw("uuid_generate_v4()"));

export const handleForeignUuid =
  (table: Knex.CreateTableBuilder) =>
  (
    column: string,
    reference: { column: string; table: string },
    required?: boolean
  ) => {
    const col = table.uuid(column);
    if (required) col.notNullable();
    table.foreign(column).references(reference.column).inTable(reference.table);

    return col;
  };

export const schemaCreator = (knex: Knex) => {
  return function columns(table: Knex.CreateTableBuilder) {
    return {
      primaryUuid: handlePrimaryUuid(knex, table),
      foreignUuid: handleForeignUuid(table),
    };
  };
};

export default { handlePrimaryUuid, handleForeignUuid, schemaCreator };
