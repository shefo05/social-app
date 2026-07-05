import { getTranslations } from "next-intl/server";
import { IconWifiOff } from "@/components/ui/icons";

export default async function OfflinePage() {
  const t = await getTranslations("offline");
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <IconWifiOff className="h-10 w-10 text-neutral-300" />
      <h1 className="text-h1 font-semibold text-ink">{t("title")}</h1>
      <p className="max-w-xs text-body text-neutral-500">{t("description")}</p>
    </div>
  );
}
