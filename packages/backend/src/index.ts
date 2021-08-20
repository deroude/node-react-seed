import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./controller/user-controller";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("i am here");
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
