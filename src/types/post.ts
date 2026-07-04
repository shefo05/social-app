import type { User } from "./user";

export enum Reaction {
  Like = 0,
  Love = 1,
  Haha = 2,
  Wow = 3,
  Sad = 4,
  Angry = 5,
}

export interface Post {
  _id: string;
  /**
   * Bare ObjectId string on list endpoints (GET /post/feed, GET /post/me) -
   * those queries don't populate the author. Only GET /post/:id (single
   * post) returns a populated User object here. Always check the type at
   * runtime before rendering author info.
   */
  userId: string | User;
  content?: string;
  attachments?: string[];
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPosts {
  data: Post[];
  page: number;
  limit: number;
  hasNext: boolean;
}
