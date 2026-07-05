import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/features/feed/components/PostCard";
import { CommentThread } from "@/features/comments/components/CommentThread";
import { IconChevronLeft } from "@/components/ui/icons";
import { feedApi } from "@/features/feed/api";
import type { Post } from "@/types";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // GET /post/:id returns 200 with `data: null` for a valid-but-missing
  // id (post.service.ts getOne just returns the Mongoose result as-is),
  // and throws inside `new mongoose.Types.ObjectId(...)` - surfacing as
  // a 500, not a clean 404 - for a malformed id string. Treat both as
  // "not found" from the frontend's point of view.
  let post: Post | null = null;
  try {
    const res = await feedApi.getPost(id);
    post = res.data;
  } catch {
    notFound();
  }
  if (!post) notFound();

  const postAuthorId =
    typeof post.userId === "string" ? post.userId : post.userId._id;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/feed"
        className="flex items-center gap-1 text-body-sm font-medium text-neutral-500 transition-colors hover:text-ink"
      >
        <IconChevronLeft className="h-4 w-4" /> Back to feed
      </Link>
      <PostCard post={post} />
      <div className="rounded-2xl border border-neutral-200 bg-surface p-5">
        <h2 className="mb-4 text-h2 font-semibold text-ink">Comments</h2>
        <CommentThread postId={id} postAuthorId={postAuthorId} />
      </div>
    </div>
  );
}
