import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProfileCard } from "@/features/profile/components/ProfileCard";

export const metadata: Metadata = { title: "Profile — Social" };

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 font-semibold text-ink">{t("title")}</h1>
      <ProfileCard />
    </div>
  );
}
