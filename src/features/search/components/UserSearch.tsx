"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconSearch, IconUserPlus } from "@/components/ui/icons";
import { cn, getErrorMessage, profileHref } from "@/lib/utils";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import type { UserSearchResult } from "@/types";
import { searchApi } from "../api";
import { friendsApi } from "@/features/friends/api";

const MIN_QUERY_LENGTH = 2;

interface UserSearchProps {
  /** Shows a quick "add" button per result that sends a friend request
   * directly, instead of only navigating to their profile - used on the
   * friends page in place of the old raw-ID form. */
  showQuickAdd?: boolean;
  onNavigate?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function UserSearch({ showQuickAdd, onNavigate, autoFocus, className }: UserSearchProps) {
  const t = useTranslations("search");
  const tFriends = useTranslations("friends");
  const router = useRouter();
  const currentUserId = useAuthStore((s) => s.user?._id);
  const showToast = useUiStore((s) => s.showToast);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const [results, setResults] = useState<UserSearchResult[] | null>(null);
  const [error, setError] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults(null);
      setError(false);
      return;
    }
    let cancelled = false;
    setError(false);
    searchApi
      .users(debouncedQuery)
      .then((res) => {
        if (cancelled) return;
        setResults(res.data.filter((u) => u._id !== currentUserId));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, currentUserId]);

  const goToProfile = (id: string) => {
    router.push(profileHref(id, currentUserId));
    onNavigate?.();
  };

  const sendRequest = async (id: string) => {
    setSendingId(id);
    try {
      await friendsApi.send(id);
      setSentIds((prev) => new Set(prev).add(id));
      showToast(tFriends("requestSent"), "success");
    } catch (err) {
      showToast(getErrorMessage(err, tFriends("requestSentError")), "error");
    } finally {
      setSendingId(null);
    }
  };

  const showDropdown = query.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <IconSearch className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          autoFocus={autoFocus}
          className="h-11 w-full rounded-xl border border-neutral-200 bg-surface ps-9 pe-3.5 text-body text-ink outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-neutral-200 bg-surface py-2 shadow-lg">
          {error ? (
            <p className="px-4 py-3 text-body-sm text-neutral-500">{t("error")}</p>
          ) : results === null ? (
            <div className="flex flex-col gap-2 px-3 py-2">
              {[0, 1].map((i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-body-sm text-neutral-500">{t("noResults")}</p>
          ) : (
            <ul className="flex flex-col">
              {results.map((result) => (
                <li key={result._id} className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-100">
                  <button
                    type="button"
                    onClick={() => goToProfile(result._id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-start"
                  >
                    <Avatar name={result.userName} src={result.profilePic} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-sm font-medium text-ink">
                        {result.userName}
                      </span>
                      {result.bio && (
                        <span className="block truncate text-micro text-neutral-400">
                          {result.bio}
                        </span>
                      )}
                    </span>
                  </button>
                  {showQuickAdd && (
                    <button
                      type="button"
                      aria-label={tFriends("requestSent")}
                      disabled={sendingId === result._id || sentIds.has(result._id)}
                      onClick={() => sendRequest(result._id)}
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        sentIds.has(result._id)
                          ? "text-success"
                          : "text-neutral-500 hover:bg-neutral-200 hover:text-ink disabled:opacity-50",
                      )}
                    >
                      <IconUserPlus className="h-4 w-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
