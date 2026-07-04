import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata: Metadata = { title: "Create an account — Social" };

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 font-semibold text-ink">Create an account</h1>
        <p className="mt-1 text-body text-neutral-500">
          Join and start sharing.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
