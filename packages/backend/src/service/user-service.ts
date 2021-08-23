import { Knex } from "knex";
import { User } from "../../../generated";
import { Database } from "./config-service";

export function getUserDAO(knex: Knex) {
  const users = () => knex.withSchema(Database.schema).table("User");

  const getUsers = async (
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

  const addUser = async (user: User): Promise<User> => {
    return users().insert(user).returning<User>("*");
  };

  const updateUser = async (id: string, user: User): Promise<User> => {
    return users().where("id", "=", id).update(user);
  };

  const deleteUser = async (id: string): Promise<void> => {
    return users().where("id", "=", id).delete();
  };

  return { getUsers, addUser, updateUser, deleteUser };
}
