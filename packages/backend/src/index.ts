import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { userController } from "./controller/user-controller";
import { createDataAccess } from "./service/data-service";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

export async function main(): Promise<void> {
  const PORT: number = parseInt(process.env.PORT as string, 10);

  const app = express();

  const knex = await createDataAccess();
  /**
   *  App Configuration
   */

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/user", userController(knex));

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({ error: "Invalid Authorization" });
      return;
    }
    res
      .status(err.statusCode || 500)
      .json({ error: err.message || "Unexpected error" });
  });
  /**
   * Server Activation
   */

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

main();
