import { apiClient } from "@/lib/api-client";
import type { RequestDashboard } from "@/types";

export const friendsApi = {
  getDashboard: (limit = 5) =>
    apiClient.get<{ success: true; data: RequestDashboard }>(
      `/request/dashboard?limit=${limit}`,
    ),
  // Still 204/no body (confirmed live) - doesn't return the created
  // request's _id, so callers that need it for a later cancel() look it
  // up via getDashboard()'s outgoingRecent instead (see FriendAction/
  // UserSearch). Cheap to switch to reading it straight off this
  // response instead, if the backend ever adds it.
  send: (receiverId: string) => apiClient.post<void>(`/request/${receiverId}`),
  accept: (id: string) => apiClient.post<void>(`/request/accept/${id}`),
  decline: (id: string) => apiClient.post<void>(`/request/decline/${id}`),
  // Sender-only; cancels by the request's own _id (not the receiver's
  // user id) - confirmed contract, backend commit daf3b2fc.
  cancel: (requestId: string) => apiClient.delete<void>(`/request/cancel/${requestId}`),
  remove: (friendId: string) =>
    apiClient.delete<void>(`/request/remove/${friendId}`),
};
