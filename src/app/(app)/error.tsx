"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ErrorState } from "@/components/feedback/ErrorState";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4">
      <ErrorState
        title={t("errors.boundaryTitle")}
        description={t("errors.boundaryDescription")}
        onRetry={reset}
      />
      <Link
        href="/feed"
        className="text-body-sm font-medium text-brand-600 hover:underline"
      >
        {t("common.backToFeed")}
      </Link>
    </div>
  );
}
