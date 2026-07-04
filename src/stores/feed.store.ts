import { create } from "zustand";
import type { Post } from "@/types";

interface FeedState {
  posts: Post[];
  page: number;
  hasNext: boolean;
  isLoading: boolean;
  setPosts: (posts: Post[], meta: { page: number; hasNext: boolean }) => void;
  appendPosts: (posts: Post[], meta: { page: number; hasNext: boolean }) => void;
  prependPost: (post: Post) => void;
  updatePost: (id: string, patch: Partial<Post>) => void;
  removePost: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  page: 1,
  hasNext: false,
  isLoading: false,
  setPosts: (posts, meta) => set({ posts, ...meta }),
  appendPosts: (posts, meta) =>
    set((state) => ({ posts: [...state.posts, ...posts], ...meta })),
  prependPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (id, patch) =>
    set((state) => ({
      posts: state.posts.map((p) => (p._id === id ? { ...p, ...patch } : p)),
    })),
  removePost: (id) =>
    set((state) => ({ posts: state.posts.filter((p) => p._id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ posts: [], page: 1, hasNext: false, isLoading: false }),
}));
