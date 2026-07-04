import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "brand" | "success" | "danger";

const variantStyles: Record<Variant, string> = {
  neutral: "bg-neutral-100 text-neutral-600",
  brand: "bg-brand-50 text-brand-700",
  success: "bg-success-bg text-success",
  danger: "bg-danger-bg text-danger",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-micro font-semibold tracking-wide uppercase",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
