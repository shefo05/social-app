import { apiClient } from "@/lib/api-client";
import type { UserSearchResult } from "@/types";

export const searchApi = {
  // GET /user/search is authenticated (isAuthenticated on the backend),
  // unlike GET /user/:id - auth defaults to true in apiClient already,
  // so no options override needed here.
  users: (q: string) =>
    apiClient.get<{ message: string; data: UserSearchResult[] }>(
      `/user/search?q=${encodeURIComponent(q)}`,
    ),
};
