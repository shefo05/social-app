import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequestsDashboard } from "@/features/friends/components/RequestsDashboard";

export const metadata: Metadata = { title: "Requests — Social" };

export default async function RequestsPage() {
  const t = await getTranslations("nav");
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 font-semibold text-ink">{t("friendRequests")}</h1>
      <RequestsDashboard />
    </div>
  );
}
