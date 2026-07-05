import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Log in — Social" };

export default async function LoginPage() {
  const t = await getTranslations("auth.login");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 font-semibold text-ink">{t("title")}</h1>
        <p className="mt-1 text-body text-neutral-500">{t("subtitle")}</p>
      </div>
      <LoginForm />
    </div>
  );
}
