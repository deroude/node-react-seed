import { Router as RouterCreator, Request, Response, Router } from "express";
import { checkJwt } from "../middleware/auth.middleware";

import { User } from "../generated/model/user";
import { Knex } from "knex";
import { getUsers } from "../service/user-service";

export function userController(dataService: Knex): Router {
  const userRouter = RouterCreator();

  userRouter.get(
    "",
    checkJwt,
    async (request: Request, response: Response<User[]>) => {
      const params: { search: string; page: number; itemsPerPage: number } =
        request.query as any;
      response
        .status(200)
        .send(
          await getUsers(dataService)(
            params.search,
            params.page,
            params.itemsPerPage
          )
        );
    }
  );

  return userRouter;
}
