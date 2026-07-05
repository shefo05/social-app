import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Own id always routes to the canonical /profile rather than
 * /profile/[id], so "click my own name" never lands on the read-only
 * public view - see ProfileView.tsx for how the two routes share it. */
export function profileHref(userId: string, currentUserId?: string | null): string {
  return userId === currentUserId ? "/profile" : `/profile/${userId}`;
}
