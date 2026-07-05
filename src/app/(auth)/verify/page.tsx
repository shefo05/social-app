import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { OtpForm } from "@/features/auth/components/OtpForm";

export const metadata: Metadata = { title: "Verify your account — Social" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/signup");

  const t = await getTranslations("auth.verify");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 font-semibold text-ink">{t("title")}</h1>
      </div>
      <OtpForm email={email} />
    </div>
  );
}
