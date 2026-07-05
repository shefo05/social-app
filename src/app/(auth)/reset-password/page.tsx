import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ResetPasswordConfirmForm } from "@/features/auth/components/ResetPasswordConfirmForm";

export const metadata: Metadata = { title: "Reset your password — Social" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/forgot-password");

  const t = await getTranslations("auth.resetPassword");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 font-semibold text-ink">{t("title")}</h1>
      </div>
      <ResetPasswordConfirmForm email={email} />
    </div>
  );
}
