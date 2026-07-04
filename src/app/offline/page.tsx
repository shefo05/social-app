import { IconWifiOff } from "@/components/ui/icons";

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <IconWifiOff className="h-10 w-10 text-neutral-300" />
      <h1 className="text-h1 font-semibold text-ink">You&apos;re offline</h1>
      <p className="max-w-xs text-body text-neutral-500">
        Looks like you&apos;ve lost your connection. Reconnect and we&apos;ll
        pick up where you left off.
      </p>
    </div>
  );
}
