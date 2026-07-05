import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { IconAlertCircle } from "@/components/ui/icons";

export default async function NotFound() {
  const t = await getTranslations();
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <IconAlertCircle className="h-10 w-10 text-neutral-300" />
      <h1 className="text-h1 font-semibold text-ink">{t("errors.notFoundTitle")}</h1>
      <p className="max-w-xs text-body text-neutral-500">
        {t("errors.notFoundDescription")}
      </p>
      <Link
        href="/feed"
        className="text-body-sm font-medium text-brand-600 hover:underline"
      >
        {t("common.backToFeed")}
      </Link>
    </div>
  );
}
