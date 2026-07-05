"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { authApi } from "@/features/auth/api";

export function ChangePasswordForm() {
  const t = useTranslations("profile.password");
  const user = useAuthStore((s) => s.user);
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showToast = useUiStore((s) => s.showToast);

  const sendCode = async () => {
    if (!user) return;
    setIsSendingCode(true);
    setError(null);
    try {
      await authApi.sendOtp({ email: user.email });
      setCodeSent(true);
      showToast(t("codeSent"), "success");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("sendError"));
    } finally {
      setIsSendingCode(false);
    }
  };

  const submit = async () => {
    if (!otp || !newPassword) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await authApi.resetPassword({ otp, newPassword });
      showToast(t("updated"), "success");
      setCodeSent(false);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("updateError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!codeSent ? (
        <Button
          variant="secondary"
          onClick={sendCode}
          isLoading={isSendingCode}
          className="self-start"
        >
          {t("emailCode")}
        </Button>
      ) : (
        <>
          <Input
            label={t("code")}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Input
            label={t("newPassword")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={submit} isLoading={isSubmitting} className="self-start">
            {t("submit")}
          </Button>
        </>
      )}
      {error && <p className="text-body-sm text-danger">{error}</p>}
    </div>
  );
}
