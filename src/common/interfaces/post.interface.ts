import { Types } from "mongoose";

export interface IPost {
  userId: Types.ObjectId;
  content?: string;
  attachments?: string[];
  reactionsCount: number;
  commentsCount: number;
  shareCount: number;
}
