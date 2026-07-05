"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { DropdownMenu, DropdownItem } from "@/components/ui/DropdownMenu";
import { IconSun, IconMoon, IconMonitor } from "@/components/ui/icons";

const OPTIONS = [
  { value: "light", key: "themeLight", icon: IconSun },
  { value: "dark", key: "themeDark", icon: IconMoon },
  { value: "system", key: "themeSystem", icon: IconMonitor },
] as const;

export function ThemeToggle() {
  const t = useTranslations("nav");
  const { theme, setTheme } = useTheme();
  // Avoid rendering theme-dependent icon before mount - the server has
  // no way to know the persisted choice, so this matches next-themes'
  // own hydration-safety guidance rather than guessing and flashing.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[0];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={t("changeTheme")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-ink"
        >
          {mounted ? <CurrentIcon className="h-5 w-5" /> : <span className="h-5 w-5" />}
        </button>
      )}
    >
      {OPTIONS.map(({ value, key, icon: Icon }) => (
        <DropdownItem
          key={value}
          active={theme === value}
          onClick={() => setTheme(value)}
        >
          <Icon className="h-4 w-4" />
          {t(key)}
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
}
