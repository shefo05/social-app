"use client";

import { useEffect, useState } from "react";
import { PostComposer } from "@/features/feed/components/PostComposer";
import { PostCard } from "@/features/feed/components/PostCard";
import { FeedSkeleton } from "@/features/feed/components/FeedSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { IconHome } from "@/components/ui/icons";
import { useFeedStore } from "@/stores/feed.store";
import { feedApi } from "@/features/feed/api";

export default function FeedPage() {
  const posts = useFeedStore((s) => s.posts);
  const hasNext = useFeedStore((s) => s.hasNext);
  const page = useFeedStore((s) => s.page);
  const isLoading = useFeedStore((s) => s.isLoading);
  const setPosts = useFeedStore((s) => s.setPosts);
  const appendPosts = useFeedStore((s) => s.appendPosts);
  const setLoading = useFeedStore((s) => s.setLoading);
  const [error, setError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = () => {
    setError(false);
    setLoading(true);
    feedApi
      .getFeed(1)
      .then((res) =>
        setPosts(res.data, { page: res.page, hasNext: res.hasNext }),
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await feedApi.getFeed(page + 1);
      appendPosts(res.data, { page: res.page, hasNext: res.hasNext });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 font-semibold text-ink">Feed</h1>
      <PostComposer />

      {error ? (
        <ErrorState title="Couldn't load your feed" onRetry={load} />
      ) : isLoading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<IconHome className="h-8 w-8" />}
          title="Your feed is quiet"
          description="Add some friends or share your first post to get things going."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          {hasNext && (
            <Button
              variant="secondary"
              onClick={loadMore}
              isLoading={loadingMore}
              className="self-center"
            >
              Load more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
