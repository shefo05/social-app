import type { Metadata } from "next";
import { RequestsDashboard } from "@/features/friends/components/RequestsDashboard";

export const metadata: Metadata = { title: "Requests — Social" };

export default function RequestsPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 font-semibold text-ink">Friend requests</h1>
      <RequestsDashboard />
    </div>
  );
}
