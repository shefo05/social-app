import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../../middleware";
import requestService from "./request.service";
import { Types } from "mongoose";

const router = Router();

router.post(
  "/:receiverId",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    await requestService.sendRequest(
      req.user._id,
      new Types.ObjectId(req.params.receiverId as string),
    );
    return res.sendStatus(204);
  },
);

router.post(
  "/accept/:id",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    await requestService.acceptRequest(
      req.user._id,
      new Types.ObjectId(req.params.id as string),
    );
    return res.sendStatus(204);
  },
);

router.post(
  "/decline/:id",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    await requestService.declineRequest2(
      req.user._id,
      new Types.ObjectId(req.params.id as string),
    );
    return res.sendStatus(204);
  },
);

router.delete(
  "/remove/:friendId",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    await requestService.removeFriend(
      req.user._id,
      new Types.ObjectId(req.params.friendId as string),
    );
    return res.sendStatus(204);
  },
);

export default router;
