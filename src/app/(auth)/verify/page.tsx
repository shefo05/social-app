import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpForm } from "@/features/auth/components/OtpForm";

export const metadata: Metadata = { title: "Verify your account — Social" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/signup");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 font-semibold text-ink">Check your email</h1>
      </div>
      <OtpForm email={email} />
    </div>
  );
}
