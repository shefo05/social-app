import { useLocale, useTranslations } from "next-intl";

export function useRelativeTime() {
  const t = useTranslations("time");
  const locale = useLocale();

  return (iso: string): string => {
    const date = new Date(iso);
    const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return t("justNow");
    if (diffMin < 60) return t("minutesAgo", { count: diffMin });
    if (diffHour < 24) return t("hoursAgo", { count: diffHour });
    if (diffDay < 7) return t("daysAgo", { count: diffDay });

    const sameYear = date.getFullYear() === new Date().getFullYear();
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: sameYear ? undefined : "numeric",
    });
  };
}
