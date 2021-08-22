import { Router as RouterCreator, Request, Response, Router } from "express";
import { checkJwt } from "../middleware/auth.middleware";

import { Article } from "../generated/model/article";
import { Knex } from "knex";
import { getArticleDAO } from "../service/article-service";

export function articleController(dataService: Knex): Router {
  const articleRouter = RouterCreator();
  const articleDAO = getArticleDAO(dataService);

  articleRouter.get(
    "",
    async (request: Request, response: Response<Article[]>) => {
      const params: { search: string; page: number; itemsPerPage: number } =
        request.query as any;
      response
        .status(200)
        .send(
          await articleDAO.getBlogArticles(
            params.search,
            params.page,
            params.itemsPerPage
          )
        );
    }
  );

  return articleRouter;
}
