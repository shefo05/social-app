import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api";
import type { Comment } from "@/types";

export const commentsApi = {
  // GET /comment/:postId throws a 404 ("no comments exist") instead of
  // returning an empty array when there are none - normalize that here
  // so every caller just gets a plain Comment[].
  getForPost: async (postId: string): Promise<Comment[]> => {
    try {
      const res = await apiClient.get<{
        success: true;
        data: { comments: Comment[] };
      }>(`/comment/${postId}`, { auth: false });
      return res.data.comments;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return [];
      throw err;
    }
  },

  create: (
    postId: string,
    payload: { content?: string; attachment?: string; mentions?: string[] },
  ) =>
    apiClient.post<{ success: true; data: { createdComment: Comment } }>(
      `/post/${postId}/comment`,
      payload,
    ),

  reply: (
    postId: string,
    parentId: string,
    payload: { content?: string; attachment?: string; mentions?: string[] },
  ) =>
    apiClient.post<{ success: true; data: { createdComment: Comment } }>(
      `/post/${postId}/comment/${parentId}`,
      payload,
    ),

  update: (
    id: string,
    payload: { content?: string; attachment?: string; mentions?: string[] },
  ) => apiClient.patch<void>(`/comment/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/comment/${id}`),

  react: (commentId: string, reaction: number) =>
    apiClient.post<void>("/comment/add-reaction", {
      id: commentId,
      reaction,
    }),
};
