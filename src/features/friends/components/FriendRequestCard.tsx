"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import type { FriendRequest } from "@/types";
import { getErrorMessage, profileHref } from "@/lib/utils";
import { friendsApi } from "../api";

export function FriendRequestCard({
  request,
  direction,
  onResolved,
}: {
  request: FriendRequest;
  direction: "incoming" | "outgoing";
  onResolved: (id: string) => void;
}) {
  const t = useTranslations("friends.requests");
  const currentUserId = useAuthStore((s) => s.user?._id);
  const [pending, setPending] = useState(false);
  const showToast = useUiStore((s) => s.showToast);
  const otherParty = direction === "incoming" ? request.sender : request.receiver;

  const respond = async (action: "accept" | "decline") => {
    setPending(true);
    try {
      if (action === "accept") await friendsApi.accept(request._id);
      else await friendsApi.decline(request._id);
      onResolved(request._id);
      showToast(action === "accept" ? t("accepted") : t("declined"), "success");
    } catch (err) {
      showToast(getErrorMessage(err, t("respondError")), "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-surface p-4">
      <Link href={profileHref(otherParty._id, currentUserId)} className="shrink-0">
        <Avatar name={otherParty.userName} src={otherParty.profilePic} size="md" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={profileHref(otherParty._id, currentUserId)} className="hover:underline">
          <p className="truncate text-body-sm font-medium text-ink">
            {otherParty.userName}
          </p>
        </Link>
        <p className="truncate text-micro text-neutral-400">
          {direction === "incoming" ? t("wantsToConnect") : t("requestSentLabel")}
        </p>
      </div>
      {direction === "incoming" && (
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() => respond("decline")}
          >
            {t("decline")}
          </Button>
          <Button size="sm" disabled={pending} onClick={() => respond("accept")}>
            {t("accept")}
          </Button>
        </div>
      )}
    </div>
  );
}
