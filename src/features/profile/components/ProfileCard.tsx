"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/auth.store";
import { Gender } from "@/types";

export function ProfileCard() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-surface p-6">
      <div className="flex items-center gap-4">
        <Avatar name={user.userName} src={user.profilePic} size="lg" />
        <div>
          <p className="text-h1 font-semibold text-ink">{user.userName}</p>
          <p className="text-body text-neutral-500">{user.email}</p>
        </div>
      </div>
      {/*
        Not displaying phoneNumber: the backend runs it through
        encryption() before storing it (src/modules/auth/auth.service.ts
        signup()) and never decrypts it back on the way out, so the API
        returns ciphertext, not a readable number - printing it verbatim
        would just show garbled text.
      */}
      {user.gender !== undefined && (
        <div className="mt-5">
          <Badge variant="brand">
            {user.gender === Gender.Male ? "Male" : "Female"}
          </Badge>
        </div>
      )}
    </div>
  );
}
