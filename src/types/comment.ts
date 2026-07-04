import type { User } from "./user";

export interface Comment {
  _id: string;
  /** Bare ObjectId string on list endpoints - see note on Post.userId. */
  userId: string | User;
  postId: string;
  parentId?: string;
  mentions?: string[];
  content?: string;
  attachment?: string;
  reactionsCount: number;
  createdAt: string;
  updatedAt: string;
}
