"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IconHeart } from "@/components/ui/icons";
import { getSocket } from "@/lib/socket";
import { Reaction, type ReactionEvent } from "@/types";
import { ApiError } from "@/types/api";
import { useUiStore } from "@/stores/ui.store";
import { feedApi } from "../api";

export function ReactionButton({
  postId,
  count,
}: {
  postId: string;
  count: number;
}) {
  // The backend has no "did I already react to this" endpoint, so this
  // is optimistic and session-only - it won't survive a page reload.
  // Only "like" is wired up in the UI (backend supports 6 reaction
  // types, but a 6-option picker felt like clutter for a first pass).
  const [reacted, setReacted] = useState(false);
  const [localCount, setLocalCount] = useState(count);
  const [pending, setPending] = useState(false);
  const showToast = useUiStore((s) => s.showToast);

  // Only fires while this post's room is joined (post detail page) -
  // the feed page never joins any post room, so this is a no-op there.
  useEffect(() => {
    const socket = getSocket();
    const onReactionNew = (payload: ReactionEvent) => {
      if (payload.targetType === "post" && payload.targetId === postId) {
        setLocalCount(payload.reactionsCount);
      }
    };
    socket.on("reaction:new", onReactionNew);
    return () => {
      socket.off("reaction:new", onReactionNew);
    };
  }, [postId]);

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    const next = !reacted;
    setReacted(next);
    setLocalCount((c) => c + (next ? 1 : -1));
    try {
      await feedApi.react(postId, Reaction.Like);
    } catch (err) {
      setReacted(!next);
      setLocalCount((c) => c + (next ? -1 : 1));
      showToast(
        err instanceof ApiError ? err.message : "Couldn't react right now.",
        "error",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-1.5 text-body-sm font-medium transition-colors",
        reacted ? "text-brand-600" : "text-neutral-500 hover:text-ink",
      )}
    >
      <IconHeart
        className={cn(
          "h-4 w-4 transition-transform duration-150",
          reacted && "scale-110 fill-current",
        )}
      />
      {localCount}
    </button>
  );
}
