"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconX } from "./icons";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-surface p-6 shadow-lg"
      >
        {title && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-h2 font-semibold text-ink">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-ink"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
