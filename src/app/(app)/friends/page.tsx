import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FriendList } from "@/features/friends/components/FriendList";
import { SendRequestForm } from "@/features/friends/components/SendRequestForm";

export const metadata: Metadata = { title: "Friends — Social" };

export default async function FriendsPage() {
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-semibold text-ink">{t("friends.title")}</h1>
        <Link
          href="/friends/requests"
          className="text-body-sm font-medium text-brand-600 hover:underline"
        >
          {t("nav.requests")}
        </Link>
      </div>
      <SendRequestForm />
      <FriendList />
    </div>
  );
}
