"use client";

import { useUiStore, type ToastVariant } from "@/stores/ui.store";
import { cn } from "@/lib/utils";
import { IconCheck, IconAlertCircle, IconX } from "@/components/ui/icons";

const variantStyles: Record<ToastVariant, string> = {
  // charcoal is a deliberately non-themed dark chip - bg-ink would
  // invert to near-white in dark mode and erase the white text below.
  default: "bg-charcoal text-white",
  success: "bg-success text-white",
  error: "bg-danger text-white",
};

export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts);
  const dismissToast = useUiStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "animate-toast-in pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-body-sm shadow-lg",
            variantStyles[toast.variant],
          )}
        >
          {toast.variant === "success" && (
            <IconCheck className="h-4 w-4 shrink-0" />
          )}
          {toast.variant === "error" && (
            <IconAlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
          >
            <IconX className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
