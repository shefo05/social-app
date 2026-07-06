"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useUiStore } from "@/stores/ui.store";
import { getErrorMessage } from "@/lib/utils";
import { loadGoogleIdentityScript } from "@/lib/google-identity";
import { authApi } from "../api";
import { useCompleteAuth } from "../hooks/useCompleteAuth";

// Real value supplied by deployment env vars - this placeholder still
// lets the button render (and everything up to the actual Google
// consent popup be verified) before a real client id is wired in.
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  "REPLACE_WITH_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

export function GoogleButton() {
  const t = useTranslations("auth.google");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const showToast = useUiStore((s) => s.showToast);
  const completeAuth = useCompleteAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Same hydration-safety reasoning as ThemeToggle - resolvedTheme is
  // unknown on the server, so wait for the client mount before touching it.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    let cancelled = false;

    loadGoogleIdentityScript(locale)
      .then(() => {
        if (cancelled || !window.google || !containerRef.current) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const res = await authApi.googleAuth({ idToken: response.credential });
              await completeAuth(res.data);
            } catch (err) {
              showToast(getErrorMessage(err, t("error")), "error");
            }
          },
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: resolvedTheme === "dark" ? "filled_black" : "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "left",
          locale,
          width: containerRef.current.offsetWidth || 320,
        });
      })
      .catch(() => {
        // Script blocked/offline - fail quietly, the password form still
        // works. There's nothing useful to retry without user action.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, resolvedTheme, locale]);

  return <div ref={containerRef} className="flex w-full justify-center" />;
}
