"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { IconAlertCircle } from "@/components/ui/icons";

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-danger-bg bg-danger-bg/40 px-6 py-12 text-center">
      <IconAlertCircle className="h-8 w-8 text-danger" />
      <p className="text-h2 font-semibold text-ink">
        {title ?? t("errors.genericTitle")}
      </p>
      <p className="max-w-sm text-body text-neutral-600">
        {description ?? t("errors.genericDescription")}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {t("common.tryAgain")}
        </Button>
      )}
    </div>
  );
}
