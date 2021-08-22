import { Router as RouterCreator, Request, Response, Router } from "express";
import { checkJwt } from "../middleware/auth.middleware";

import { User } from "../generated/model/user";
import { Knex } from "knex";
import { getUserDAO } from "../service/user-service";

export function userController(dataService: Knex): Router {
  const userRouter = RouterCreator();
  const userDAO = getUserDAO(dataService);

  userRouter.get(
    "",
    checkJwt,
    async (request: Request, response: Response<User[]>) => {
      const params: { filter: string; page: number; itemsPerPage: number } =
        request.query as any;
      response
        .status(200)
        .send(
          await userDAO.getUsers(
            params.filter,
            params.page,
            params.itemsPerPage
          )
        );
    }
  );

  userRouter.post(
    "",
    checkJwt,
    async (request: Request, response: Response<User>) => {
      response.status(200).send(await userDAO.addUser(request.body));
    }
  );

  userRouter.get(
    "",
    checkJwt,
    async (request: Request, response: Response<User[]>) => {
      const params: { search: string; page: number; itemsPerPage: number } =
        request.query as any;
      try {
        response
          .status(200)
          .send(
            await userDAO.getUsers(
              params.search,
              params.page,
              params.itemsPerPage
            )
          );
      } catch (err) {
        console.log(err);
      }
    }
  );

  userRouter.get(
    "",
    checkJwt,
    async (request: Request, response: Response<User[]>) => {
      const params: { search: string; page: number; itemsPerPage: number } =
        request.query as any;
      try {
        response
          .status(200)
          .send(
            await userDAO.getUsers(
              params.search,
              params.page,
              params.itemsPerPage
            )
          );
      } catch (err) {
        console.log(err);
      }
    }
  );

  return userRouter;
}
