import type { PostAuthor } from "./post";

export interface Comment {
  _id: string;
  /**
   * Populated with the same userName/profilePic-only shape as
   * Post.userId on both create/reply and getAll (see
   * comment.service.ts). PATCH /comment/:id returns void, not a comment
   * at all, so there's no unpopulated-write case here unlike Post.
   * Always check the type at runtime before rendering author info.
   */
  userId: string | PostAuthor;
  postId: string;
  parentId?: string;
  mentions?: string[];
  content?: string;
  attachment?: string;
  reactionsCount: number;
  createdAt: string;
  updatedAt: string;
}
