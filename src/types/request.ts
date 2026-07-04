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
