import Link from "next/link";
import { IconAlertCircle } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <IconAlertCircle className="h-10 w-10 text-neutral-300" />
      <h1 className="text-h1 font-semibold text-ink">Page not found</h1>
      <p className="max-w-xs text-body text-neutral-500">
        That page doesn&apos;t exist, or it may have been removed.
      </p>
      <Link
        href="/feed"
        className="text-body-sm font-medium text-brand-600 hover:underline"
      >
        Back to feed
      </Link>
    </div>
  );
}
