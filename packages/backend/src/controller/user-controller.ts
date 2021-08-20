import { Router, Request, Response } from "express";
import { checkJwt } from "../middleware/auth.middleware";

import { User } from "../generated/model/user";

export const userRouter = Router();

userRouter.get(
  "",
  checkJwt,
  async (request: Request, response: Response<User[]>) => {
    response.status(200).send([]);
  }
);
