import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "brand" | "success" | "danger";

const variantStyles: Record<Variant, string> = {
  neutral: "bg-neutral-100 text-neutral-600",
  // text-brand-700 stays a fixed dark blue across themes (it also
  // doubles as Button's pressed-state background), so it needs an
  // explicit light override here rather than a token-level flip -
  // otherwise the badge text goes near-invisible against the dark
  // tinted background in dark mode.
  brand: "bg-brand-50 text-brand-700 dark:text-brand-200",
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
