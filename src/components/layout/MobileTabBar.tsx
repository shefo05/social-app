"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { Avatar } from "@/components/ui/Avatar";
import { IconHome, IconUsers, IconBell } from "@/components/ui/icons";

const TAB_ITEMS = [
  { href: "/feed", label: "Feed", icon: IconHome },
  { href: "/friends", label: "Friends", icon: IconUsers },
  { href: "/friends/requests", label: "Requests", icon: IconBell },
];

export function MobileTabBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const profileActive = pathname === "/profile";

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-neutral-200 bg-white/95 px-2 py-2 backdrop-blur",
        className,
      )}
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      {TAB_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Icon
              className={cn("h-5 w-5", active ? "text-brand-600" : "text-neutral-400")}
            />
            <span
              className={cn(
                "text-micro",
                active ? "font-semibold text-brand-600" : "text-neutral-400",
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
      <Link href="/profile" className="flex flex-col items-center gap-1 px-3 py-1">
        <Avatar
          name={user?.userName ?? "?"}
          src={user?.profilePic}
          size="sm"
          className={cn(profileActive && "ring-2 ring-brand-500")}
        />
        <span
          className={cn(
            "text-micro",
            profileActive ? "font-semibold text-brand-600" : "text-neutral-400",
          )}
        >
          Profile
        </span>
      </Link>
    </nav>
  );
}
