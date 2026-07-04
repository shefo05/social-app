import type { User } from "./user";

export enum Reaction {
  Like = 0,
  Love = 1,
  Haha = 2,
  Wow = 3,
  Sad = 4,
  Angry = 5,
}

export type PostAuthor = Pick<User, "_id" | "userName" | "profilePic">;

export interface Post {
  _id: string;
  /**
   * All three GET endpoints (feed/me/single) now populate this, but
   * feed/me only select userName/profilePic (see post.service.ts) while
   * single-post populates the full User unqualified - PostAuthor is the
   * common subset safe to rely on everywhere. Still a bare ObjectId
   * string on writes (create/update responses don't populate). Always
   * check the type at runtime before rendering author info.
   */
  userId: string | PostAuthor;
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
