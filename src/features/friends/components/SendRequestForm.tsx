"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("friends");
  const tCommon = useTranslations("common");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useUiStore((s) => s.showToast);

  const submit = async () => {
    const trimmed = userId.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await friendsApi.send(trimmed);
      showToast(t("requestSent"), "success");
      setUserId("");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t("requestSentError"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-surface p-4">
      <div className="flex items-end gap-2">
        <Input
          label={t("sendByIdLabel")}
          name="friendUserId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder={t("sendByIdPlaceholder")}
          className="flex-1"
        />
        <Button
          onClick={submit}
          isLoading={isSubmitting}
          disabled={!userId.trim()}
        >
          {tCommon("send")}
        </Button>
      </div>
    </div>
  );
}
