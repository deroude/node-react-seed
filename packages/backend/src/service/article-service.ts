import { Knex } from "knex";
import { Article } from "../generated/model/article";
import { Database } from "./config-service";

export function getArticleDAO(knex: Knex) {
  const articles = () => knex.withSchema(Database.schema).table("Article");
  const getBlogArticles = async (
    filter?: string,
    itemsPerPage = 20,
    page = 0
  ): Promise<Article[]> => {
    const qb = articles();
    if (!!filter) {
      qb.where("title", "like", `%${filter}%`);
    }
    return qb
      .where("category", "BLOG")
      .orderBy("publishDate", "desc")
      .limit(itemsPerPage)
      .offset(page * itemsPerPage);
  };
  return { getBlogArticles };
}
