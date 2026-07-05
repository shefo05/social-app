"use client";

import { useAuthStore } from "@/stores/auth.store";
import { ProfileView } from "./ProfileView";

/** /profile (the "me" route) reads straight from the already-hydrated
 * auth store - no fetch needed, unlike /profile/[id] which fetches the
 * public GET /user/:id. Both render the same ProfileView. */
export function MyProfileView() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  return (
    <ProfileView profile={user} isOwnProfile email={user.email} gender={user.gender} />
  );
}
