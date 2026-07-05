import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProfileView } from "@/features/profile/components/ProfileView";
import { profileApi } from "@/features/profile/api";
import type { PublicProfile } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await profileApi.getPublicProfile(id);
    return { title: `${res.data.userName} — Social` };
  } catch {
    return { title: "Profile — Social" };
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // GET /user/:id 404s (a real 404 status, not a 200-with-null) for both
  // a nonexistent and a soft-deleted id, on purpose - an outside viewer
  // shouldn't be able to tell those apart. Any thrown error here means
  // "no such profile", so it's all treated as notFound().
  let profile: PublicProfile;
  try {
    const res = await profileApi.getPublicProfile(id);
    profile = res.data;
  } catch {
    notFound();
  }

  return <ProfileView profile={profile} isOwnProfile={false} />;
}
