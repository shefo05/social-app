import type { PostAuthor } from "./post";

export interface FriendRequest {
  _id: string;
  sender: string;
  receiver: string;
  createdAt: string;
}

export interface RequestDashboard {
  incomingCount: number;
  outgoingCount: number;
  incomingRecent: FriendRequest[];
  outgoingRecent: FriendRequest[];
}

/** Socket payloads - distinct from the REST FriendRequest shape above,
 * which never populates sender/receiver. See realtime.gateway.ts. */
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
