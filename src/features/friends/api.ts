import { apiClient } from "@/lib/api-client";
import type { RequestDashboard } from "@/types";

export const friendsApi = {
  getDashboard: (limit = 5) =>
    apiClient.get<{ success: true; data: RequestDashboard }>(
      `/request/dashboard?limit=${limit}`,
    ),
  send: (receiverId: string) => apiClient.post<void>(`/request/${receiverId}`),
  accept: (id: string) => apiClient.post<void>(`/request/accept/${id}`),
  decline: (id: string) => apiClient.post<void>(`/request/decline/${id}`),
  remove: (friendId: string) =>
    apiClient.delete<void>(`/request/remove/${friendId}`),
};
