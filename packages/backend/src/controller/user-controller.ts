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

  userRouter.delete(
    "/:id",
    checkJwt,
    async (request: Request, response: Response<void>) => {
      const params: { id: string } = request.params as any;
      await userDAO.deleteUser(params.id);
      response.status(200);
    }
  );

  userRouter.put(
    "/:id",
    checkJwt,
    async (request: Request, response: Response<User>) => {
      const params: { id: string } = request.params as any;
      response
        .status(200)
        .send(await userDAO.updateUser(params.id, request.body));
    }
  );

  return userRouter;
}
