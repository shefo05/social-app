"use client";

import { useTranslations } from "next-intl";
import { UserSearch } from "@/features/search/components/UserSearch";

export function SendRequestForm() {
  const t = useTranslations("friends");

  return (
    <div className="rounded-2xl border border-neutral-200 bg-surface p-4">
      <p className="mb-3 text-body-sm font-medium text-neutral-700">
        {t("findLabel")}
      </p>
      <UserSearch showQuickAdd />
    </div>
  );
}
