"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { friendsApi } from "../api";

/**
 * There's no user search/directory endpoint on the backend yet (`/user/`
 * only returns your own profile) - so there's no list to pick a person
 * from. This takes a raw user id, which is the only handle that
 * actually exists right now. Swap for a search-and-pick UI once a
 * lookup/search endpoint exists.
 */
export function SendRequestForm() {
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useUiStore((s) => s.showToast);

  const submit = async () => {
    const trimmed = userId.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await friendsApi.send(trimmed);
      showToast("Friend request sent", "success");
      setUserId("");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't send that request.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-end gap-2">
        <Input
          label="Add a friend by user ID"
          name="friendUserId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="e.g. 6650f1c2a1b2c3d4e5f6a7b8"
          className="flex-1"
        />
        <Button
          onClick={submit}
          isLoading={isSubmitting}
          disabled={!userId.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
