"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function RootPage() {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(accessToken ? "/feed" : "/login");
  }, [hasHydrated, accessToken, router]);

  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
    </div>
  );
}
