import { apiClient } from "@/lib/api-client";
import type { FriendRequest, RequestDashboard } from "@/types";

export const friendsApi = {
  getDashboard: (limit = 5) =>
    apiClient.get<{ success: true; data: RequestDashboard }>(
      `/request/dashboard?limit=${limit}`,
    ),
  // 201 with the created request, populated the same way as a dashboard
  // entry - confirmed live, backend commit 0a8404d9. Callers use
  // data._id directly for a later cancel(), no dashboard round-trip.
  send: (receiverId: string) =>
    apiClient.post<{ success: true; data: FriendRequest }>(`/request/${receiverId}`),
  accept: (id: string) => apiClient.post<void>(`/request/accept/${id}`),
  decline: (id: string) => apiClient.post<void>(`/request/decline/${id}`),
  // Sender-only; cancels by the request's own _id (not the receiver's
  // user id) - confirmed contract, backend commit daf3b2fc.
  cancel: (requestId: string) => apiClient.delete<void>(`/request/cancel/${requestId}`),
  remove: (friendId: string) =>
    apiClient.delete<void>(`/request/remove/${friendId}`),
};
