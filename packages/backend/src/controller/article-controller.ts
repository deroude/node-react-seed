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
      const params: {
        filter: string;
        category: string;
        page: number;
        itemsPerPage: number;
      } = request.query as any;
      response
        .status(200)
        .send(
          await articleDAO.getBlogArticles(
            params.filter,
            params.category,
            params.page,
            params.itemsPerPage
          )
        );
    }
  );

  articleRouter.post(
    "",
    checkJwt,
    async (request: Request, response: Response<Article>) => {
      response.status(200).send(await articleDAO.addArticle(request.body));
    }
  );

  articleRouter.delete(
    "/:id",
    checkJwt,
    async (request: Request, response: Response<void>) => {
      const params: { id: string } = request.params as any;
      await articleDAO.deleteArticle(params.id);
      response.status(200);
    }
  );

  articleRouter.put(
    "/:id",
    checkJwt,
    async (request: Request, response: Response<Article>) => {
      const params: { id: string } = request.params as any;
      response
        .status(200)
        .send(await articleDAO.updateArticle(params.id, request.body));
    }
  );

  return articleRouter;
}
