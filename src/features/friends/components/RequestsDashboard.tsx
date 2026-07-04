"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconBell } from "@/components/ui/icons";
import { useRequestsStore } from "@/stores/requests.store";
import type { RequestDashboard as RequestDashboardType } from "@/types";
import { friendsApi } from "../api";
import { FriendRequestCard } from "./FriendRequestCard";

export function RequestsDashboard() {
  const [dashboard, setDashboard] = useState<RequestDashboardType | null>(null);
  const [error, setError] = useState(false);
  const setIncomingCount = useRequestsStore((s) => s.setIncomingCount);
  const decrementIncoming = useRequestsStore((s) => s.decrementIncoming);

  const load = () => {
    setError(false);
    setDashboard(null);
    friendsApi
      .getDashboard(20)
      .then((res) => {
        setDashboard(res.data);
        // Sync the nav badge with the authoritative count whenever this
        // page is actually visited (it may be stale from AppShell's
        // one-off fetch if requests arrived in another session).
        setIncomingCount(res.data.incomingCount);
      })
      .catch(() => setError(true));
  };

  useEffect(load, []);

  const removeFromList = (id: string) => {
    // Decrement as a plain call in the event handler, not inside the
    // setDashboard updater below - React can invoke that updater during
    // render (e.g. Strict Mode's double-invoke), and triggering a
    // different store's setState from in there is what to update a
    // component while rendering a different component warns about.
    if (dashboard?.incomingRecent.some((r) => r._id === id)) {
      decrementIncoming();
    }
    setDashboard((prev) =>
      prev
        ? {
            ...prev,
            incomingRecent: prev.incomingRecent.filter((r) => r._id !== id),
            outgoingRecent: prev.outgoingRecent.filter((r) => r._id !== id),
          }
        : prev,
    );
  };

  if (error) {
    return <ErrorState title="Couldn't load requests" onRetry={load} />;
  }

  if (dashboard === null) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 text-h2 font-semibold text-ink">Incoming</h2>
        {dashboard.incomingRecent.length === 0 ? (
          <EmptyState
            icon={<IconBell className="h-7 w-7" />}
            title="No pending requests"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {dashboard.incomingRecent.map((r) => (
              <FriendRequestCard
                key={r._id}
                request={r}
                direction="incoming"
                onResolved={removeFromList}
              />
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-h2 font-semibold text-ink">Sent</h2>
        {dashboard.outgoingRecent.length === 0 ? (
          <EmptyState
            icon={<IconBell className="h-7 w-7" />}
            title="You haven't sent any requests"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {dashboard.outgoingRecent.map((r) => (
              <FriendRequestCard
                key={r._id}
                request={r}
                direction="outgoing"
                onResolved={removeFromList}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
