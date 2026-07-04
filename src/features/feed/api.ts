import { apiClient } from "@/lib/api-client";
import type { PaginatedPosts, Post, Reaction } from "@/types";

export const feedApi = {
  getFeed: (page: number, limit = 10) =>
    apiClient.get<{ success: true } & PaginatedPosts>(
      `/post/feed?page=${page}&limit=${limit}`,
    ),
  getMyPosts: (page: number, limit = 10) =>
    apiClient.get<{ success: true } & PaginatedPosts>(
      `/post/me?page=${page}&limit=${limit}`,
    ),
  getPost: (id: string) =>
    apiClient.get<{ success: true; data: Post }>(`/post/${id}`, {
      auth: false,
    }),
  // FormData when attaching images (field name "attachments", up to 4 -
  // see uploadAttachments() middleware / post.controller.ts), plain JSON
  // for text-only posts.
  createPost: (payload: FormData | { content?: string; attachments?: string[] }) =>
    apiClient.post<{ success: true; data: { createdPost: Post } }>(
      "/post",
      payload,
    ),
  updatePost: (
    id: string,
    payload: { content?: string; attachments?: string[] },
  ) => apiClient.patch<{ success: true; data: Post }>(`/post/${id}`, payload),
  deletePost: (id: string) =>
    apiClient.delete<{ success: true }>(`/post/${id}`),
  react: (postId: string, reaction: Reaction) =>
    apiClient.post<void>("/post/add-reaction", { id: postId, reaction }),
};
