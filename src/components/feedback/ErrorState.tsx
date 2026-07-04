"use client";

import { Button } from "@/components/ui/Button";
import { IconAlertCircle } from "@/components/ui/icons";

export function ErrorState({
  title = "Something didn't load right",
  description = "That's on us, not you. Give it another try.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-danger-bg bg-danger-bg/40 px-6 py-12 text-center">
      <IconAlertCircle className="h-8 w-8 text-danger" />
      <p className="text-h2 font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-body text-neutral-600">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
