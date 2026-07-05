"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { usePresenceStore } from "@/stores/presence.store";
import type { UserFriend } from "@/types";
import { authApi } from "@/features/auth/api";

/** Friend list data is real (same GET /user/ friends already used by
 * FriendList); presence dots reflect usePresenceStore, populated in
 * AppShell.tsx from the GET /user/online-friends snapshot plus live
 * presence:online/offline socket events. */
export function FriendsSidebar({ className }: { className?: string }) {
  const t = useTranslations("friends");
  const currentUserId = useAuthStore((s) => s.user?._id);
  const onlineUserIds = usePresenceStore((s) => s.onlineUserIds);
  const [friends, setFriends] = useState<UserFriend[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    authApi
      .getMe()
      .then((res) => setFriends(res.data.friends as UserFriend[]))
      .catch(() => setError(true));
  }, []);

  return (
    <aside
      className={cn(
        "sticky top-16 flex h-[calc(100dvh-4rem)] w-72 shrink-0 flex-col gap-4 overflow-y-auto border-s border-neutral-200 bg-surface p-5",
        className,
      )}
    >
      <h2 className="text-h2 font-semibold text-ink">{t("title")}</h2>

      {error ? (
        <p className="text-body-sm text-neutral-500">{t("loadErrorGeneric")}</p>
      ) : friends === null ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : friends.length === 0 ? (
        <p className="text-body-sm text-neutral-500">{t("seeThemHere")}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {friends.map((f) => {
            const otherPerson = f.user._id === currentUserId ? f.friend : f.user;
            const isOnline = onlineUserIds.has(otherPerson._id);
            return (
              <li key={f._id}>
                <Link
                  href="/friends"
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-neutral-100"
                >
                  <span className="relative shrink-0">
                    <Avatar name={otherPerson.userName} src={otherPerson.profilePic} size="sm" />
                    <span
                      role="status"
                      aria-label={isOnline ? t("online") : t("offline")}
                      className={cn(
                        "absolute -end-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface",
                        isOnline ? "bg-success" : "bg-neutral-300",
                      )}
                    />
                  </span>
                  <span className="truncate text-body-sm font-medium text-ink">
                    {otherPerson.userName}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
