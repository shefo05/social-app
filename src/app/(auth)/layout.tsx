import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/ui/Logo";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations();
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-8 flex items-center gap-2">
        <Logo size={36} />
        <span className="text-h1 font-semibold text-ink">{t("nav.brand")}</span>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-surface p-6 shadow-sm sm:p-8">
        {children}
      </div>
      {/* <p className="mt-6 max-w-sm text-center text-micro text-neutral-400">
        {t("auth.waking")}
      </p> */}
    </div>
  );
}
