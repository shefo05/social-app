"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { IconSearch } from "@/components/ui/icons";
import { UserSearch } from "@/features/search/components/UserSearch";

/** Icon-triggered search panel for the navbar/mobile header - same
 * click-outside/Escape pattern as DropdownMenu, just anchoring a
 * UserSearch instead of a menu list. */
export function SearchButton() {
  const t = useTranslations("search");
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
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={t("open")}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-ink"
      >
        <IconSearch className="h-5 w-5" />
      </button>
      {isOpen && (
        <UserSearch
          autoFocus
          onNavigate={() => setIsOpen(false)}
          className="absolute end-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)]"
        />
      )}
    </div>
  );
}
