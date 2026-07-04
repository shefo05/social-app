import type { Metadata } from "next";
import { ProfileCard } from "@/features/profile/components/ProfileCard";

export const metadata: Metadata = { title: "Profile — Social" };

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 font-semibold text-ink">Your profile</h1>
      <ProfileCard />
    </div>
  );
}
