"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import type { FriendRequest } from "@/types";
import { friendsApi } from "../api";

/**
 * The backend's Request model only stores sender/receiver ObjectIds -
 * there's no populate anywhere in request.service.ts and no public
 * GET /user/:id endpoint, so there's no name/avatar to resolve here.
 * Showing a truncated id is honest about what data actually exists;
 * a backend change (populate or a lookup endpoint) would unlock this.
 */
export function FriendRequestCard({
  request,
  direction,
  onResolved,
}: {
  request: FriendRequest;
  direction: "incoming" | "outgoing";
  onResolved: (id: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const showToast = useUiStore((s) => s.showToast);
  const otherPartyId = direction === "incoming" ? request.sender : request.receiver;

  const respond = async (action: "accept" | "decline") => {
    setPending(true);
    try {
      if (action === "accept") await friendsApi.accept(request._id);
      else await friendsApi.decline(request._id);
      onResolved(request._id);
      showToast(
        action === "accept" ? "Friend request accepted" : "Request declined",
        "success",
      );
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't update that request.",
        "error",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
      <Avatar name={otherPartyId} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-medium text-ink">
          {direction === "incoming" ? "Wants to connect with you" : "Request sent"}
        </p>
        <p className="truncate text-micro text-neutral-400">
          User …{otherPartyId.slice(-6)}
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
            Decline
          </Button>
          <Button size="sm" disabled={pending} onClick={() => respond("accept")}>
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}
