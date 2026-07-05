import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MobileHeader({ className }: { className?: string }) {
  const t = useTranslations("nav");
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-neutral-200 bg-surface/95 px-4 py-3 backdrop-blur",
        className,
      )}
    >
      <Link href="/feed" className="flex items-center gap-2">
        <Logo size={28} />
        <span className="text-h2 font-semibold text-ink">{t("brand")}</span>
      </Link>
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
