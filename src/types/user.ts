import type { PostAuthor } from "./post";

export enum Gender {
  Male = 0,
  Female = 1,
}

export enum Role {
  User = 0,
  Admin = 1,
}

export enum Provider {
  System = 0,
  Google = 1,
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  gender?: Gender;
  provider: Provider;
  profilePic?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /user/:id - explicit field allowlist, never email/phoneNumber/role. */
export interface PublicProfile {
  _id: string;
  userName: string;
  profilePic?: string;
  bio?: string;
  createdAt: string;
}

export interface UserFriend {
  _id: string;
  /** GET /user/'s friends list always populates both sides now. */
  user: PostAuthor;
  friend: PostAuthor;
  relationship?: string;
  closeFriend: boolean;
  createdAt: string;
}
