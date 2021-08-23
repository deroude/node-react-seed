import { Knex } from "knex";
import { Article } from "../../../generated";
import { Database } from "./config-service";

export function getArticleDAO(knex: Knex) {
  const articles = () => knex.withSchema(Database.schema).table("Article");
  const getBlogArticles = async (
    filter?: string,
    category?: string,
    itemsPerPage = 20,
    page = 0
  ): Promise<Article[]> => {
    const qb = articles();
    if (!!filter) {
      qb.where("title", "like", `%${filter}%`);
    }
    if (!!category) {
      qb.where("category", "=", category);
    }
    return qb
      .where("category", "BLOG")
      .orderBy("publishDate", "desc")
      .limit(itemsPerPage)
      .offset(page * itemsPerPage);
  };

  const addArticle = async (article: Article): Promise<Article> => {
    return articles().insert(article).returning<Article>("*");
  };

  const updateArticle = async (
    id: string,
    article: Article
  ): Promise<Article> => {
    return articles().where("id", "=", id).update(article);
  };

  const deleteArticle = async (id: string): Promise<void> => {
    return articles().where("id", "=", id).delete();
  };

  return { getBlogArticles, addArticle, updateArticle, deleteArticle };
}
