"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconBell } from "@/components/ui/icons";
import type { RequestDashboard as RequestDashboardType } from "@/types";
import { friendsApi } from "../api";
import { FriendRequestCard } from "./FriendRequestCard";

export function RequestsDashboard() {
  const [dashboard, setDashboard] = useState<RequestDashboardType | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setDashboard(null);
    friendsApi
      .getDashboard(20)
      .then((res) => setDashboard(res.data))
      .catch(() => setError(true));
  };

  useEffect(load, []);

  const removeFromList = (id: string) => {
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
