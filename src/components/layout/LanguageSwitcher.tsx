"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { DropdownMenu, DropdownItem } from "@/components/ui/DropdownMenu";
import { IconGlobe, IconCheck } from "@/components/ui/icons";
import { locales, localeNames, LOCALE_COOKIE, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();

  const changeLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  };

  return (
    <DropdownMenu
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={t("changeLanguage")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-ink"
        >
          <IconGlobe className="h-5 w-5" />
        </button>
      )}
    >
      {locales.map((value) => (
        <DropdownItem
          key={value}
          active={locale === value}
          onClick={() => changeLocale(value)}
        >
          <IconCheck
            className={locale === value ? "h-4 w-4" : "h-4 w-4 opacity-0"}
          />
          {localeNames[value]}
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
}
