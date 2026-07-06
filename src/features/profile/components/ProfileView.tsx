"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { IconHome, IconUserPlus } from "@/components/ui/icons";
import { PostCard } from "@/features/feed/components/PostCard";
import { FeedSkeleton } from "@/features/feed/components/FeedSkeleton";
import { feedApi } from "@/features/feed/api";
import { authApi } from "@/features/auth/api";
import { friendsApi } from "@/features/friends/api";
import { useUiStore } from "@/stores/ui.store";
import { getErrorMessage } from "@/lib/utils";
import { profileApi } from "../api";
import { Gender, type Post, type PublicProfile, type UserFriend } from "@/types";

interface ProfileViewProps {
  profile: PublicProfile;
  isOwnProfile: boolean;
  /** Only known/shown for the account owner - never present on a public profile. */
  email?: string;
  gender?: Gender;
}

/**
 * There's no "relationship status with user X" endpoint, so this checks
 * the current user's own friends list for a match - the same source
 * FriendList/FriendsSidebar already use. Only rendered for someone
 * else's profile, so a match always means "friends with the viewer."
 */
function FriendAction({ profileId }: { profileId: string }) {
  const t = useTranslations("friends");
  const showToast = useUiStore((s) => s.showToast);
  const [status, setStatus] = useState<"loading" | "friends" | "none" | "sent">("loading");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authApi
      .getMe()
      .then((res) => {
        if (cancelled) return;
        const friends = res.data.friends as UserFriend[];
        const isFriend = friends.some(
          (f) => f.user._id === profileId || f.friend._id === profileId,
        );
        setStatus(isFriend ? "friends" : "none");
      })
      .catch(() => {
        if (!cancelled) setStatus("none");
      });
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const send = async () => {
    setIsSending(true);
    try {
      await friendsApi.send(profileId);
      setStatus("sent");
      showToast(t("requestSent"), "success");
    } catch (err) {
      showToast(getErrorMessage(err, t("requestSentError")), "error");
    } finally {
      setIsSending(false);
    }
  };

  if (status === "loading") return null;
  if (status === "friends") {
    return (
      <Badge variant="neutral" className="shrink-0">
        {t("alreadyFriends")}
      </Badge>
    );
  }
  return (
    <Button
      variant={status === "sent" ? "secondary" : "primary"}
      size="sm"
      disabled={status === "sent" || isSending}
      isLoading={isSending}
      onClick={send}
      className="shrink-0"
    >
      <IconUserPlus className="h-4 w-4" />
      {status === "sent" ? t("requests.requestSentLabel") : t("sendFriendRequest")}
    </Button>
  );
}

export function ProfileView({ profile, isOwnProfile, email, gender }: ProfileViewProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = (pageNum: number) =>
    isOwnProfile ? feedApi.getMyPosts(pageNum) : profileApi.getUserPosts(profile._id, pageNum);

  const load = () => {
    setError(false);
    setPosts(null);
    fetchPage(1)
      .then((res) => {
        setPosts(res.data);
        setPage(res.page);
        setHasNext(res.hasNext);
      })
      .catch(() => setError(true));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [profile._id, isOwnProfile]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetchPage(page + 1);
      setPosts((prev) => [...(prev ?? []), ...res.data]);
      setPage(res.page);
      setHasNext(res.hasNext);
    } finally {
      setLoadingMore(false);
    }
  };

  const memberSince = new Date(profile.createdAt).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-neutral-200 bg-surface p-6">
        <div className="flex items-center gap-4">
          <Avatar name={profile.userName} src={profile.profilePic} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-h1 font-semibold text-ink">{profile.userName}</p>
            {isOwnProfile && email && (
              <p className="truncate text-body text-neutral-500">{email}</p>
            )}
            <p className="text-body-sm text-neutral-400">
              {t("memberSince", { date: memberSince })}
            </p>
          </div>
          {isOwnProfile ? (
            <Link href="/settings" className="shrink-0">
              <Button variant="secondary" size="sm">
                {t("editProfile")}
              </Button>
            </Link>
          ) : (
            <FriendAction profileId={profile._id} />
          )}
        </div>

        {profile.bio && (
          <p className="mt-4 whitespace-pre-wrap text-body text-ink">{profile.bio}</p>
        )}

        {isOwnProfile && gender !== undefined && (
          <div className="mt-4">
            <Badge variant="brand">
              {gender === Gender.Male ? t("genderMale") : t("genderFemale")}
            </Badge>
          </div>
        )}
      </div>

      {error ? (
        <ErrorState title={t("loadError")} onRetry={load} />
      ) : posts === null ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<IconHome className="h-8 w-8" />}
          title={t("postsEmptyTitle")}
          description={t("postsEmptyDescription")}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdated={(id, patch) =>
                setPosts((prev) => prev?.map((p) => (p._id === id ? { ...p, ...patch } : p)) ?? null)
              }
              onDeleted={(id) =>
                setPosts((prev) => prev?.filter((p) => p._id !== id) ?? null)
              }
            />
          ))}
          {hasNext && (
            <Button
              variant="secondary"
              onClick={loadMore}
              isLoading={loadingMore}
              className="self-center"
            >
              {tCommon("loadMore")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
