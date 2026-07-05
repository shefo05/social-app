"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconUsers } from "@/components/ui/icons";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import type { UserFriend } from "@/types";
import { authApi } from "@/features/auth/api";
import { friendsApi } from "../api";

export function FriendList() {
  const currentUserId = useAuthStore((s) => s.user?._id);
  const [friends, setFriends] = useState<UserFriend[] | null>(null);
  const [error, setError] = useState(false);
  const showToast = useUiStore((s) => s.showToast);

  const load = () => {
    setError(false);
    setFriends(null);
    authApi
      .getMe()
      .then((res) => setFriends(res.data.friends as UserFriend[]))
      .catch(() => setError(true));
  };

  useEffect(load, []);

  const remove = async (friendship: UserFriend) => {
    const otherPerson =
      friendship.user._id === currentUserId ? friendship.friend : friendship.user;
    try {
      await friendsApi.remove(otherPerson._id);
      setFriends(
        (prev) => prev?.filter((f) => f._id !== friendship._id) ?? null,
      );
      showToast("Friend removed", "success");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't remove that friend.",
        "error",
      );
    }
  };

  if (error) {
    return <ErrorState title="Couldn't load friends" onRetry={load} />;
  }

  if (friends === null) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <EmptyState
        icon={<IconUsers className="h-8 w-8" />}
        title="No friends yet"
        description="Send a friend request to start building your network."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {friends.map((f) => {
        const otherPerson = f.user._id === currentUserId ? f.friend : f.user;
        return (
          <div
            key={f._id}
            className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-surface p-4"
          >
            <Avatar name={otherPerson.userName} src={otherPerson.profilePic} size="md" />
            <p className="flex-1 truncate text-body-sm font-medium text-ink">
              {otherPerson.userName}
            </p>
            <Button size="sm" variant="ghost" onClick={() => remove(f)}>
              Remove
            </Button>
          </div>
        );
      })}
    </div>
  );
}
