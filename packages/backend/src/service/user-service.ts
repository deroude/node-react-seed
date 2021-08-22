import { Knex } from "knex";
import { User } from "../generated/model/user";
import { Database } from "./config-service";

export function getUsers(knex: Knex) {
  const users = () => knex.withSchema(Database.schema).table("User");
  const execute = async (
    filter?: string,
    itemsPerPage = 20,
    page = 0
  ): Promise<User[]> => {
    const qb = users();
    if (!!filter) {
      qb.where("email", "like", `%${filter}%`);
    }
    return qb.limit(itemsPerPage).offset(page * itemsPerPage);
  };
  return execute;
}
