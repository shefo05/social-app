"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import type { Comment } from "@/types";
import { commentsApi } from "../api";

export function CommentForm({
  postId,
  parentId,
  onCreated,
}: {
  postId: string;
  parentId?: string;
  onCreated: (comment: Comment) => void;
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useUiStore((s) => s.showToast);

  const submit = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = parentId
        ? await commentsApi.reply(postId, parentId, { content: trimmed })
        : await commentsApi.create(postId, { content: trimmed });
      onCreated(res.data.createdComment);
      setContent("");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't comment right now.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-body-sm text-ink outline-none transition-colors duration-150 focus:border-brand-300 focus:bg-white"
      />
      <Button
        size="sm"
        onClick={submit}
        isLoading={isSubmitting}
        disabled={!content.trim()}
      >
        Send
      </Button>
    </div>
  );
}
