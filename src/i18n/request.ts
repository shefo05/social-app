import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, locales, LOCALE_COOKIE, type Locale } from "./config";

/**
 * "Without i18n routing" next-intl setup - no /en/ /ar/ URL segment.
 * This app is entirely behind auth with no SEO surface, so the usual
 * [locale] segment (which would mean moving every route under
 * src/app/[locale]/) buys nothing here; a cookie is enough. The
 * LanguageSwitcher writes this same cookie name directly.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
