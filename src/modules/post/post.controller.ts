import { Request, NextFunction, Response, Router } from "express";
import postService from "./post.service";
import { Types } from "mongoose";
import { createPostSchema } from "./post.validation";
import { isAuthenticated, isvalid } from "../../middleware";
import { default as commentRouter } from "../comment/comment.controller";
import { addReaction } from "../../common";
import { postRepo } from "../../DB/models/post/post.repository";

const router = Router();

router.use("/:postId/comment", commentRouter);

router.post(
  "/",
  isvalid(createPostSchema),
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const createdPost = await postService.create(req.body, req.user._id);
    return res.status(201).json({
      message: "post created successfully",
      success: true,
      data: { createdPost },
    });
  },
);

router.post(
  "/add-reaction",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    await addReaction(req.body, req.user._id, postRepo);
    // await postService.addReaction(
    //   req.body,
    //   req.user._id,
    // );
    return res.sendStatus(204);
  },
);
export default router;
