import express, { NextFunction, Request, Response } from "express";
import {
  authRouter,
  commentRouter,
  postRouter,
  requestRouter,
} from "./modules";
import { BadRequestException, NotFoundException } from "./common";
import { connectDB } from "./DB/connection";
import { redisConnect } from "./DB/redis.connect";
import { s3CloudProvider } from "./common/cloud/s3/init";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pipelinePromise = promisify(pipeline);

export function bootstrap() {
  const app = express();
  const port = 3000;

  app.get(
    "/uploads/*paths",
    async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.params.paths);

      let key = (req.params.paths as string[]).join("/");
      console.log(key);

      const fileExist = await s3CloudProvider.getFile(key);
      if (!fileExist) {
        new NotFoundException("file not found");
      }
      await pipelinePromise(fileExist, res);
    },
  );

  connectDB();
  redisConnect();

  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/request", requestRouter);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status((err.cause as number) || 500).json({
      message: err.message,
      success: false,
      details: err instanceof BadRequestException ? err.details : undefined,
    });
  });
  app.listen(port, () => {
    console.log("app is running on port", port);
  });
}
