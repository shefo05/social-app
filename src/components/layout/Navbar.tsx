"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useRequestsStore } from "@/stores/requests.store";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { CountBadge } from "@/components/ui/CountBadge";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import {
  IconHome,
  IconUsers,
  IconBell,
  IconSettings,
  IconLogOut,
} from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/feed", label: "Feed", icon: IconHome },
  { href: "/friends", label: "Friends", icon: IconUsers },
  { href: "/friends/requests", label: "Requests", icon: IconBell },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const incomingCount = useRequestsStore((s) => s.incomingCount);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-dvh w-64 shrink-0 flex-col border-r border-neutral-200 bg-surface px-4 py-6",
        className,
      )}
    >
      <div className="mb-8 flex items-center justify-between px-2">
        <Link href="/feed" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-h2 font-semibold text-ink">Social</span>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-body font-medium transition-colors duration-150",
                active
                  ? "bg-brand-50 text-brand-700 dark:text-brand-200"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-ink",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
              {href === "/friends/requests" && (
                <CountBadge count={incomingCount} className="ml-auto" />
              )}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/profile"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-neutral-100"
      >
        <Avatar name={user?.userName ?? "?"} src={user?.profilePic} size="sm" />
        <span className="truncate text-body-sm font-medium text-ink">
          {user?.userName}
        </span>
      </Link>
      <button
        onClick={() => {
          logout();
          router.replace("/login");
        }}
        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm text-neutral-500 transition-colors duration-150 hover:bg-neutral-100 hover:text-danger"
      >
        <IconLogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}
