
import dotenv from "dotenv";

dotenv.config();

export namespace Database {
  export const schema = process.env.DATABASE_SCHEMA || "api";
  export const database = process.env.DATABASE_NAME || "postgres";
  export const host = process.env.DATABASE_HOST || "localhost";
  export const port = Number(process.env.DATABASE_PORT || "5432");
  export const username = process.env.DATABASE_USERNAME || "postgres";
  export const password = process.env.DATABASE_PASSWORD || "postgres";
  export const poolMin = Number(process.env.DATABASE_POOL_MIN || "0");
  export const poolMax = Number(process.env.DATABASE_POOL_MAX || "10");
}

export namespace Server {
  export const port = Number(process.env.PORT || "7000");
  export const bodyLimit = "100kb";
  export const corsHeaders = ["Link"];
  export const isDev = process.env.NODE_ENV === "development";
}

export namespace Knex {
  export const config = {
    client: "pg",
    connection: {
      host: Database.host,
      database: Database.database,
      user: Database.username,
      password: Database.password,
      port: Database.port,
    },
    pool: {
      min: process.env.DATABASE_POOL_MIN,
      max: process.env.DATABASE_POOL_MAX,
    },
    migrations: {
      tableName: "KnexMigrations",
    },
  };
}

export default { Database, Server, Knex };
