import { apiClient } from "@/lib/api-client";
import type { PaginatedPosts, PublicProfile } from "@/types";

export const profileApi = {
  // Both unauthenticated on the backend (same treatment as GET /post/:id)
  // - auth: false is just documentation here, since apiClient only
  // attaches a token when one exists and this route ignores it either way.
  getPublicProfile: (id: string) =>
    apiClient.get<{ message: string; data: PublicProfile }>(`/user/${id}`, {
      auth: false,
    }),
  getUserPosts: (id: string, page: number, limit = 10) =>
    apiClient.get<{ success: true } & PaginatedPosts>(
      `/post/user/${id}?page=${page}&limit=${limit}`,
      { auth: false },
    ),
};
