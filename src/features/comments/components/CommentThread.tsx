"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { IconMessageCircle } from "@/components/ui/icons";
import { formatRelativeTime } from "@/lib/utils";
import type { Comment, User } from "@/types";
import { commentsApi } from "../api";
import { CommentForm } from "./CommentForm";

function isPopulatedUser(userId: Comment["userId"]): userId is User {
  return typeof userId === "object" && userId !== null;
}

function CommentItem({
  comment,
  postId,
  onReplyCreated,
}: {
  comment: Comment;
  postId: string;
  onReplyCreated: (c: Comment) => void;
}) {
  const [replying, setReplying] = useState(false);
  const author = isPopulatedUser(comment.userId) ? comment.userId : null;
  const authorLabel = author?.userName ?? "Someone";

  return (
    <div className="flex gap-3">
      <Avatar name={authorLabel} src={author?.profilePic} size="sm" />
      <div className="flex-1">
        <div className="rounded-2xl bg-neutral-50 px-3.5 py-2.5">
          <p className="text-body-sm font-semibold text-ink">{authorLabel}</p>
          <p className="text-body-sm text-ink">{comment.content}</p>
        </div>
        <div className="mt-1 flex items-center gap-3 px-1">
          <span className="text-micro text-neutral-400">
            {formatRelativeTime(comment.createdAt)}
          </span>
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

export function CommentThread({ postId }: { postId: string }) {
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
                onReplyCreated={addComment}
              />
              {(repliesByParent.get(comment._id) ?? []).map((reply) => (
                <div key={reply._id} className="ml-11">
                  <CommentItem
                    comment={reply}
                    postId={postId}
                    onReplyCreated={addComment}
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
