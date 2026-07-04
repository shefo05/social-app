import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-8 flex items-center gap-2">
        <Logo size={36} />
        <span className="text-h1 font-semibold text-ink">Social</span>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        {children}
      </div>
      <p className="mt-6 max-w-sm text-center text-micro text-neutral-400">
        First request after a few minutes of inactivity can take up to a
        minute — the free-tier server is waking up.
      </p>
    </div>
  );
}
