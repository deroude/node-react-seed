import { Router, Request, Response } from "express";
import { requiredScopes } from 'express-oauth2-bearer';

import { User } from "../generated/model/user";

export const userRouter = Router();

userRouter.get('', requiredScopes('admin'), async (request: Request, response: Response<User[]>) => {
    response.status(200).send([]);
})