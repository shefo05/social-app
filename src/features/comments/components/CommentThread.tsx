"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { IconHeart, IconMessageCircle } from "@/components/ui/icons";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { Reaction, type Comment, type PostAuthor } from "@/types";
import { commentsApi } from "../api";
import { CommentForm } from "./CommentForm";

function isPopulatedAuthor(userId: Comment["userId"]): userId is PostAuthor {
  return typeof userId === "object" && userId !== null;
}

function CommentReactionButton({ commentId, count }: { commentId: string; count: number }) {
  // Same caveat as the post ReactionButton: no "did I already react"
  // endpoint, so this is optimistic/session-only.
  const [reacted, setReacted] = useState(false);
  const [localCount, setLocalCount] = useState(count);
  const [pending, setPending] = useState(false);
  const showToast = useUiStore((s) => s.showToast);

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    const next = !reacted;
    setReacted(next);
    setLocalCount((c) => c + (next ? 1 : -1));
    try {
      await commentsApi.react(commentId, Reaction.Like);
    } catch (err) {
      setReacted(!next);
      setLocalCount((c) => c + (next ? -1 : 1));
      showToast(
        err instanceof ApiError ? err.message : "Couldn't react right now.",
        "error",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-1 text-micro font-semibold transition-colors",
        reacted ? "text-brand-600" : "text-neutral-500 hover:text-brand-600",
      )}
    >
      <IconHeart className={cn("h-3.5 w-3.5", reacted && "fill-current")} />
      {localCount}
    </button>
  );
}

function CommentItem({
  comment,
  postId,
  postAuthorId,
  onReplyCreated,
  onUpdated,
  onDeleted,
}: {
  comment: Comment;
  postId: string;
  postAuthorId?: string;
  onReplyCreated: (c: Comment) => void;
  onUpdated: (id: string, patch: Partial<Comment>) => void;
  onDeleted: (id: string) => void;
}) {
  const currentUserId = useAuthStore((s) => s.user?._id);
  const showToast = useUiStore((s) => s.showToast);
  const [replying, setReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const author = isPopulatedAuthor(comment.userId) ? comment.userId : null;
  const authorLabel = author?.userName ?? "Someone";
  const authorId = author?._id ?? (typeof comment.userId === "string" ? comment.userId : null);
  const isAuthor = currentUserId != null && authorId === currentUserId;
  const canDelete =
    isAuthor || (currentUserId != null && postAuthorId === currentUserId);

  const saveEdit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setIsSaving(true);
    try {
      await commentsApi.update(comment._id, { content: trimmed });
      onUpdated(comment._id, { content: trimmed });
      setIsEditing(false);
      showToast("Comment updated", "success");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't update that comment.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteComment = async () => {
    if (!window.confirm("Delete this comment? This can't be undone.")) return;
    setIsDeleting(true);
    try {
      await commentsApi.delete(comment._id);
      showToast("Comment deleted", "success");
      onDeleted(comment._id);
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't delete that comment.",
        "error",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Avatar name={authorLabel} src={author?.profilePic} size="sm" />
      <div className="flex-1">
        <div className="rounded-2xl bg-neutral-50 px-3.5 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-body-sm font-semibold text-ink">{authorLabel}</p>
            {(isAuthor || canDelete) && !isEditing && (
              <div className="flex shrink-0 gap-2">
                {isAuthor && (
                  <button
                    onClick={() => {
                      setContent(comment.content ?? "");
                      setIsEditing(true);
                    }}
                    className="text-micro font-medium text-neutral-400 transition-colors hover:text-ink"
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={deleteComment}
                    disabled={isDeleting}
                    className="text-micro font-medium text-neutral-400 transition-colors hover:text-danger disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="mt-1 flex flex-col gap-2">
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                }}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-body-sm text-ink outline-none focus:border-brand-300"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={saveEdit} isLoading={isSaving} disabled={!content.trim()}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-body-sm text-ink">{comment.content}</p>
          )}
        </div>
        <div className="mt-1 flex items-center gap-3 px-1">
          <span className="text-micro text-neutral-400">
            {formatRelativeTime(comment.createdAt)}
          </span>
          <CommentReactionButton commentId={comment._id} count={comment.reactionsCount} />
          <button
            onClick={() => setReplying((v) => !v)}
            className="text-micro font-semibold text-neutral-500 transition-colors hover:text-brand-600"
          >
            Reply
          </button>
        </div>
        {replying && (
          <div className="mt-2">
            <CommentForm
              postId={postId}
              parentId={comment._id}
              onCreated={(c) => {
                onReplyCreated(c);
                setReplying(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentThread({
  postId,
  postAuthorId,
}: {
  postId: string;
  postAuthorId?: string;
}) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setComments(null);
    commentsApi
      .getForPost(postId)
      .then(setComments)
      .catch(() => setError(true));
  };

  useEffect(load, [postId]);

  const addComment = (c: Comment) =>
    setComments((prev) => [...(prev ?? []), c]);

  const updateComment = (id: string, patch: Partial<Comment>) =>
    setComments(
      (prev) => prev?.map((c) => (c._id === id ? { ...c, ...patch } : c)) ?? null,
    );

  const removeComment = (id: string) =>
    setComments((prev) => prev?.filter((c) => c._id !== id && c.parentId !== id) ?? null);

  if (error) {
    return <ErrorState title="Couldn't load comments" onRetry={load} />;
  }

  if (comments === null) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-2xl bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesByParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (c.parentId) {
      const list = repliesByParent.get(c.parentId) ?? [];
      list.push(c);
      repliesByParent.set(c.parentId, list);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <CommentForm postId={postId} onCreated={addComment} />

      {topLevel.length === 0 ? (
        <EmptyState
          icon={<IconMessageCircle className="h-8 w-8" />}
          title="No comments yet"
          description="Be the first to say something."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {topLevel.map((comment) => (
            <div key={comment._id} className="flex flex-col gap-3">
              <CommentItem
                comment={comment}
                postId={postId}
                postAuthorId={postAuthorId}
                onReplyCreated={addComment}
                onUpdated={updateComment}
                onDeleted={removeComment}
              />
              {(repliesByParent.get(comment._id) ?? []).map((reply) => (
                <div key={reply._id} className="ml-11">
                  <CommentItem
                    comment={reply}
                    postId={postId}
                    postAuthorId={postAuthorId}
                    onReplyCreated={addComment}
                    onUpdated={updateComment}
                    onDeleted={removeComment}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
