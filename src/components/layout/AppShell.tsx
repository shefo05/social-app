"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth.store";
import { useRequestsStore } from "@/stores/requests.store";
import { useUiStore } from "@/stores/ui.store";
import { usePresenceStore } from "@/stores/presence.store";
import { friendsApi } from "@/features/friends/api";
import { authApi } from "@/features/auth/api";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import type { PresenceEvent, RequestAcceptedEvent, RequestNewEvent } from "@/types";
import { Navbar } from "./Navbar";
import { MobileHeader } from "./MobileHeader";
import { MobileTabBar } from "./MobileTabBar";
import { FriendsSidebar } from "./FriendsSidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("friends");
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setIncomingCount = useRequestsStore((s) => s.setIncomingCount);
  const incrementIncoming = useRequestsStore((s) => s.incrementIncoming);
  const showToast = useUiStore((s) => s.showToast);
  const setOnline = usePresenceStore((s) => s.setOnline);
  const setOffline = usePresenceStore((s) => s.setOffline);
  const setOnlineUserIds = usePresenceStore((s) => s.setOnlineUserIds);

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

  // Socket lifecycle: connect once authenticated, disconnect on logout.
  // Personal notifications (request:new/accepted) are global - they
  // should reach the user regardless of what page they're on, unlike
  // post:join/leave which is scoped to the post detail page itself.
  useEffect(() => {
    if (!hasHydrated || !accessToken) {
      disconnectSocket();
      return;
    }
    const socket = connectSocket(accessToken);

    const onRequestNew = (payload: RequestNewEvent) => {
      incrementIncoming();
      showToast(t("sentSocketToast", { name: payload.sender.userName }), "success");
    };
    const onRequestAccepted = (payload: RequestAcceptedEvent) => {
      showToast(t("acceptedSocketToast", { name: payload.accepter.userName }), "success");
    };

    socket.on("request:new", onRequestNew);
    socket.on("request:accepted", onRequestAccepted);

    return () => {
      socket.off("request:new", onRequestNew);
      socket.off("request:accepted", onRequestAccepted);
    };
  }, [hasHydrated, accessToken, incrementIncoming, showToast, t]);

  // Presence: fetch the initial online-friends snapshot on every connect
  // (including reconnects, same as CommentThread's post:join re-emit) -
  // a dropped connection means we missed whatever presence events fired
  // while offline, so re-fetching the snapshot rather than trusting the
  // stale in-memory set is what keeps this correct after a reconnect.
  useEffect(() => {
    if (!hasHydrated || !accessToken) return;
    const socket = getSocket();

    const fetchSnapshot = () => {
      authApi
        .getOnlineFriends()
        .then((res) => setOnlineUserIds(res.data.onlineFriendIds))
        .catch(() => {});
    };
    fetchSnapshot();
    socket.on("connect", fetchSnapshot);

    const onPresenceOnline = (payload: PresenceEvent) => setOnline(payload.userId);
    const onPresenceOffline = (payload: PresenceEvent) => setOffline(payload.userId);
    socket.on("presence:online", onPresenceOnline);
    socket.on("presence:offline", onPresenceOffline);

    return () => {
      socket.off("connect", fetchSnapshot);
      socket.off("presence:online", onPresenceOnline);
      socket.off("presence:offline", onPresenceOffline);
    };
  }, [hasHydrated, accessToken, setOnline, setOffline, setOnlineUserIds]);

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
    <div className="flex min-h-dvh flex-col bg-background">
      <Navbar className="hidden md:flex" />
      <MobileHeader className="md:hidden" />
      <div className="flex flex-1">
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 pb-20 md:px-8 md:py-10 md:pb-10">
          {children}
        </main>
        <FriendsSidebar className="hidden lg:flex" />
      </div>
      <MobileTabBar className="md:hidden" />
    </div>
  );
}
