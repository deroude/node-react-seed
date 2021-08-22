import Knex from "knex";
import { Database } from "./config-service";

export async function createDataAccess() {
  const knex = Knex({
    client: "pg",
    connection: {
      user: Database.username,
      password: Database.password,
      host: Database.host,
      port: Database.port,
      database: Database.database,
    },
    pool: {
      min: Database.poolMin,
      max: Database.poolMax,
    },
    acquireConnectionTimeout: 2000,
    asyncStackTraces: true
  });

  // Verify the connection before proceeding
  try {
    await knex.raw("SELECT now()");

    return knex;
  } catch (error) {
    throw new Error(
      "Unable to connect to Postgres via Knex. Ensure a valid connection."
    );
  }
}
