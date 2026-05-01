import { Types } from "mongoose";

export interface IPost {
  userId: Types.ObjectId;
  content?: string | undefined;
  attachments?: string[] | undefined;
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;
}
