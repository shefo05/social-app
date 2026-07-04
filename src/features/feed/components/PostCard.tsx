"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconMessageCircle } from "@/components/ui/icons";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import type { Post, PostAuthor } from "@/types";
import { feedApi } from "../api";
import { ReactionButton } from "./ReactionButton";

function isPopulatedAuthor(userId: Post["userId"]): userId is PostAuthor {
  return typeof userId === "object" && userId !== null;
}

export function PostCard({
  post,
  onUpdated,
  onDeleted,
}: {
  post: Post;
  /** Feed page passes useFeedStore.updatePost to keep the list in sync. */
  onUpdated?: (id: string, patch: Partial<Post>) => void;
  /** Feed page passes useFeedStore.removePost; post detail redirects to /feed instead. */
  onDeleted?: (id: string) => void;
}) {
  const router = useRouter();
  const currentUserId = useAuthStore((s) => s.user?._id);
  const showToast = useUiStore((s) => s.showToast);
  const author = isPopulatedAuthor(post.userId) ? post.userId : null;
  // Only unpopulated right after creating a post (see note on
  // Post.userId) - fall back to a neutral label rather than faking a name.
  const authorLabel = author?.userName ?? "Someone in your network";
  const authorId = author?._id ?? (typeof post.userId === "string" ? post.userId : null);
  const isOwner = currentUserId != null && authorId === currentUserId;

  const [content, setContent] = useState(post.content ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const attachments = post.attachments;

  const saveEdit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setIsSaving(true);
    try {
      await feedApi.updatePost(post._id, { content: trimmed });
      onUpdated?.(post._id, { content: trimmed });
      setContent(trimmed);
      setIsEditing(false);
      showToast("Post updated", "success");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't update that post.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    setIsDeleting(true);
    try {
      await feedApi.deletePost(post._id);
      showToast("Post deleted", "success");
      if (onDeleted) onDeleted(post._id);
      else router.replace("/feed");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't delete that post.",
        "error",
      );
      setIsDeleting(false);
    }
  };

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow duration-150 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar name={authorLabel} src={author?.profilePic} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-semibold text-ink">
            {authorLabel}
          </p>
          <p className="text-body-sm text-neutral-400">
            {formatRelativeTime(post.createdAt)}
          </p>
        </div>
        {isOwner && !isEditing && (
          <div className="flex shrink-0 gap-3">
            <button
              onClick={() => {
                setContent(post.content ?? "");
                setIsEditing(true);
              }}
              className="text-body-sm font-medium text-neutral-500 transition-colors hover:text-ink"
            >
              Edit
            </button>
            <button
              onClick={deletePost}
              disabled={isDeleting}
              className="text-body-sm font-medium text-neutral-500 transition-colors hover:text-danger disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-4 flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-body text-ink outline-none transition-colors duration-150 focus:border-brand-300 focus:bg-white"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setContent(post.content ?? "");
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={saveEdit}
              isLoading={isSaving}
              disabled={!content.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        content && (
          <p className="mt-4 whitespace-pre-wrap text-body-lg leading-relaxed text-ink">
            {content}
          </p>
        )
      )}

      {attachments && attachments.length > 0 && (
        <div
          className={cn(
            "mt-4 grid gap-2",
            attachments.length > 1 ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          {attachments.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt=""
              loading="lazy"
              className={cn(
                "w-full rounded-xl bg-neutral-100 object-cover",
                attachments.length > 1 ? "aspect-square" : "max-h-96",
              )}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-5 border-t border-neutral-100 pt-3">
        <ReactionButton postId={post._id} count={post.reactionsCount} />
        <Link
          href={`/post/${post._id}`}
          className="flex items-center gap-1.5 text-body-sm font-medium text-neutral-500 transition-colors duration-150 hover:text-ink"
        >
          <IconMessageCircle className="h-4 w-4" />
          {post.commentsCount}
        </Link>
      </div>
    </article>
  );
}
