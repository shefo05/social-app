"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useRequestsStore } from "@/stores/requests.store";
import { Avatar } from "@/components/ui/Avatar";
import { CountBadge } from "@/components/ui/CountBadge";
import { IconHome, IconUsers, IconBell } from "@/components/ui/icons";

const TAB_ITEMS = [
  { href: "/feed", key: "feed", icon: IconHome },
  { href: "/friends", key: "friends", icon: IconUsers },
  { href: "/friends/requests", key: "requests", icon: IconBell },
] as const;

export function MobileTabBar({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const incomingCount = useRequestsStore((s) => s.incomingCount);
  const profileActive = pathname === "/profile";

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-neutral-200 bg-surface/95 px-2 py-2 backdrop-blur",
        className,
      )}
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      {TAB_ITEMS.map(({ href, key, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <span className="relative">
              <Icon
                className={cn("h-5 w-5", active ? "text-brand-600" : "text-neutral-400")}
              />
              {href === "/friends/requests" && (
                <CountBadge count={incomingCount} className="absolute -end-1.5 -top-1.5" />
              )}
            </span>
            <span
              className={cn(
                "text-micro",
                active ? "font-semibold text-brand-600" : "text-neutral-400",
              )}
            >
              {t(key)}
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
          {t("profile")}
        </span>
      </Link>
    </nav>
  );
}
