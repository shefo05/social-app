"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 disabled:bg-neutral-200 disabled:text-neutral-400",
  secondary:
    "bg-neutral-100 text-ink hover:bg-neutral-200 active:bg-neutral-300 disabled:text-neutral-400",
  ghost:
    "bg-transparent text-ink hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400",
  danger:
    "bg-danger text-white hover:bg-danger/90 active:bg-danger/80 disabled:bg-neutral-200 disabled:text-neutral-400",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-body-sm",
  md: "h-10 px-4 text-body",
  lg: "h-12 px-6 text-body-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span
            aria-hidden
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
