"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/auth.store";
import { useFeedStore } from "@/stores/feed.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { feedApi } from "../api";

export function PostComposer() {
  const user = useAuthStore((s) => s.user);
  const prependPost = useFeedStore((s) => s.prependPost);
  const showToast = useUiStore((s) => s.showToast);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await feedApi.createPost({ content: trimmed });
      prependPost(res.data.createdPost);
      setContent("");
      showToast("Post shared", "success");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't post right now.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex gap-3">
        <Avatar name={user?.userName ?? "?"} src={user?.profilePic} size="md" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={2}
          className="flex-1 resize-none rounded-xl border border-transparent bg-neutral-50 px-3.5 py-2.5 text-body text-ink outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-brand-300 focus:bg-white"
        />
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          onClick={submit}
          isLoading={isSubmitting}
          disabled={!content.trim()}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
