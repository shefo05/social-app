import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Log in — Social" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-body text-neutral-500">
          Log in to see what&apos;s new.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
