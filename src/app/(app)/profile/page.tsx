import type { Metadata } from "next";
import { MyProfileView } from "@/features/profile/components/MyProfileView";

export const metadata: Metadata = { title: "Profile — Social" };

export default function ProfilePage() {
  return <MyProfileView />;
}
