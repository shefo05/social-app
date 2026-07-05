"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-body-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 rounded-xl border border-neutral-200 bg-surface px-3.5 text-body text-ink outline-none transition-colors duration-150 placeholder:text-neutral-400",
            "focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
            error &&
              "border-danger focus:border-danger focus:ring-danger-bg",
            className,
          )}
          {...props}
        />
        {error && <p className="text-body-sm text-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
