"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal anchored popover menu - click the trigger to open, click
 * outside or Escape to close. `align` controls which edge of the
 * trigger the menu hangs from; logical (start/end) rather than
 * left/right so it mirrors correctly under dir="rtl".
 */
export function DropdownMenu({
  trigger,
  children,
  align = "end",
  className,
}: {
  trigger: (props: { isOpen: boolean; toggle: () => void }) => ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      {trigger({ isOpen, toggle: () => setIsOpen((v) => !v) })}
      {isOpen && (
        <div
          role="menu"
          // Item clicks bubble here after their own onClick already ran -
          // closing on bubble (rather than requiring every DropdownItem
          // caller to remember to close it themselves) is what makes
          // "select an option" also dismiss the menu.
          onClick={() => setIsOpen(false)}
          className={cn(
            "absolute top-full z-50 mt-2 min-w-40 rounded-xl border border-neutral-200 bg-surface py-1.5 shadow-lg",
            align === "end" ? "end-0" : "start-0",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-start text-body-sm font-medium transition-colors",
        active ? "text-brand-600" : "text-ink hover:bg-neutral-100",
      )}
    >
      {children}
    </button>
  );
}
