import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata: Metadata = { title: "Create an account — Social" };

export default async function SignupPage() {
  const t = await getTranslations("auth.signup");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 font-semibold text-ink">{t("title")}</h1>
        <p className="mt-1 text-body text-neutral-500">{t("subtitle")}</p>
      </div>
      <SignupForm />
    </div>
  );
}
