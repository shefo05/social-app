import type { PostAuthor } from "./post";

export interface FriendRequest {
  _id: string;
  /** GET /request/dashboard always populates both sides now. */
  sender: PostAuthor;
  receiver: PostAuthor;
  createdAt: string;
}

export interface RequestDashboard {
  incomingCount: number;
  outgoingCount: number;
  incomingRecent: FriendRequest[];
  outgoingRecent: FriendRequest[];
}

/** Socket payload - unlike the REST FriendRequest shape above, only
 * sender is populated here; receiver is just the current user's own id
 * (no need to populate yourself). See realtime.gateway.ts. */
export interface RequestNewEvent {
  _id: string;
  sender: PostAuthor;
  receiver: string;
  createdAt: string;
}

export interface RequestAcceptedEvent {
  _id: string;
  accepter: PostAuthor;
}
