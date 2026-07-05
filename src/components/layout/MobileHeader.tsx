import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export function MobileHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-neutral-200 bg-surface/95 px-4 py-3 backdrop-blur",
        className,
      )}
    >
      <Link href="/feed" className="flex items-center gap-2">
        <Logo size={28} />
        <span className="text-h2 font-semibold text-ink">Social</span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
