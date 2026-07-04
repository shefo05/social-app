"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { authApi } from "@/features/auth/api";

export function ChangePasswordForm() {
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
      showToast("Check your email for a code", "success");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't send a code.");
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
      showToast("Password updated", "success");
      setCodeSent(false);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't update your password.",
      );
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
          Email me a code to change my password
        </Button>
      ) : (
        <>
          <Input
            label="Verification code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={submit} isLoading={isSubmitting} className="self-start">
            Update password
          </Button>
        </>
      )}
      {error && <p className="text-body-sm text-danger">{error}</p>}
    </div>
  );
}
