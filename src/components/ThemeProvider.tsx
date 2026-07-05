"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * next-themes handles the FOUC-prevention itself: with attribute="class"
 * it injects a small blocking inline script into <head> that sets the
 * .dark class on <html> from localStorage before React hydrates, so
 * there's no flash of the wrong theme on load. Light is the default for
 * a first-time visitor (not "system") - see globals.css for what the
 * .dark class actually overrides.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
