"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useRequestsStore } from "@/stores/requests.store";
import { friendsApi } from "@/features/friends/api";
import { Navbar } from "./Navbar";
import { MobileHeader } from "./MobileHeader";
import { MobileTabBar } from "./MobileTabBar";
import { ToastHost } from "@/components/feedback/ToastHost";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setIncomingCount = useRequestsStore((s) => s.setIncomingCount);

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, router]);

  // Best-effort badge count for the nav - decorative, so a failure here
  // just means no badge rather than a broken shell.
  useEffect(() => {
    if (!hasHydrated || !accessToken) return;
    friendsApi
      .getDashboard(1)
      .then((res) => setIncomingCount(res.data.incomingCount))
      .catch(() => {});
  }, [hasHydrated, accessToken, setIncomingCount]);

  // Gate on hydration so we never flash the shell before we know whether
  // there's actually a persisted session (avoids an SSR/client mismatch
  // since the token only lives in localStorage).
  if (!hasHydrated || !accessToken) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <Navbar className="hidden md:flex" />
      <div className="flex-1 pb-20 md:pb-0">
        <MobileHeader className="md:hidden" />
        <main className="mx-auto w-full max-w-2xl px-4 py-6 md:px-8 md:py-10">
          {children}
        </main>
      </div>
      <MobileTabBar className="md:hidden" />
      <ToastHost />
    </div>
  );
}
