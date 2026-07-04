"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorState } from "@/components/feedback/ErrorState";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4">
      <ErrorState
        title="Something went wrong"
        description="That's on us, not you. Give it another try, or head back to your feed."
        onRetry={reset}
      />
      <Link
        href="/feed"
        className="text-body-sm font-medium text-brand-600 hover:underline"
      >
        Back to feed
      </Link>
    </div>
  );
}
