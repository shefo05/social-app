"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import type { AuthResult } from "@/types/api";
import { authApi } from "../api";

/**
 * Shared by password login and Google sign-in - both end up with the
 * same AuthResult shape and need the same next steps: stash the tokens,
 * fetch the user, and pick the right welcome toast. `reactivated` can
 * come from either flow (a soft-deleted account signing back in);
 * `isNewUser` only ever comes from Google, since password signup is a
 * separate OTP-gated flow with its own "welcome" moment already.
 */
export function useCompleteAuth() {
  const t = useTranslations("auth.login");
  const tGoogle = useTranslations("auth.google");
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);

  return async (result: AuthResult) => {
    useAuthStore.setState({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    const me = await authApi.getMe();
    useAuthStore.getState().setSession(me.data.user, result);

    if (result.reactivated) {
      showToast(t("reactivatedToast"), "success");
    } else if (result.isNewUser) {
      showToast(tGoogle("newUserToast", { name: me.data.user.userName }), "success");
    } else {
      showToast(t("welcomeBack", { name: me.data.user.userName }), "success");
    }
    router.replace("/feed");
  };
}
