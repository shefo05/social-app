import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { IconMessageCircle } from "@/components/ui/icons";
import { cn, formatRelativeTime } from "@/lib/utils";
import { API_URL } from "@/lib/api-client";
import type { Post, User } from "@/types";
import { ReactionButton } from "./ReactionButton";

function isPopulatedUser(userId: Post["userId"]): userId is User {
  return typeof userId === "object" && userId !== null;
}

export function PostCard({ post }: { post: Post }) {
  const author = isPopulatedUser(post.userId) ? post.userId : null;
  // Feed/my-posts list endpoints don't populate the author (see note on
  // Post.userId) - fall back to a neutral label rather than faking a name.
  const authorLabel = author?.userName ?? "Someone in your network";

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
      </div>

      {post.content && (
        <p className="mt-4 whitespace-pre-wrap text-body-lg leading-relaxed text-ink">
          {post.content}
        </p>
      )}

      {post.attachments && post.attachments.length > 0 && (
        <div
          className={cn(
            "mt-4 grid gap-2",
            post.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          {post.attachments.map((key) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={key}
              src={`${API_URL}/uploads/${key}`}
              alt=""
              className="max-h-96 w-full rounded-xl object-cover"
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
