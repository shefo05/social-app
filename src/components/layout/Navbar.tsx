"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useRequestsStore } from "@/stores/requests.store";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { CountBadge } from "@/components/ui/CountBadge";
import { DropdownMenu, DropdownItem } from "@/components/ui/DropdownMenu";
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
  { href: "/settings", label: "Settings", icon: IconSettings },
];

export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const incomingCount = useRequestsStore((s) => s.incomingCount);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 w-full shrink-0 items-center gap-6 border-b border-neutral-200 bg-surface px-6",
        className,
      )}
    >
      <Link href="/feed" className="flex shrink-0 items-center gap-2">
        <Logo size={30} />
        <span className="text-h2 font-semibold text-ink">Social</span>
      </Link>

      <nav className="flex flex-1 items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-body-sm font-medium transition-colors duration-150",
                active
                  ? "bg-brand-50 text-brand-700 dark:text-brand-200"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-ink",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-1">
        <ThemeToggle />

        <Link
          href="/friends/requests"
          aria-label="Friend requests"
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            pathname?.startsWith("/friends/requests")
              ? "bg-brand-50 text-brand-700 dark:text-brand-200"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-ink",
          )}
        >
          <IconBell className="h-5 w-5" />
          <CountBadge count={incomingCount} className="absolute end-1 top-1" />
        </Link>

        <DropdownMenu
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-2 rounded-xl py-1.5 ps-1.5 pe-2.5 transition-colors hover:bg-neutral-100"
            >
              <Avatar name={user?.userName ?? "?"} src={user?.profilePic} size="sm" />
              <span className="hidden max-w-28 truncate text-body-sm font-medium text-ink md:inline">
                {user?.userName}
              </span>
            </button>
          )}
        >
          <DropdownItem onClick={() => router.push("/profile")}>
            View profile
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              logout();
              router.replace("/login");
            }}
          >
            <IconLogOut className="h-4 w-4" />
            Log out
          </DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
