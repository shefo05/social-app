"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { authApi } from "../api";
import {
  resetPasswordConfirmSchema,
  type ResetPasswordConfirmFormValues,
} from "../schemas";

export function ResetPasswordConfirmForm({ email }: { email: string }) {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const [formError, setFormError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordConfirmFormValues>({
    resolver: zodResolver(resetPasswordConfirmSchema),
  });

  const onSubmit = async (values: ResetPasswordConfirmFormValues) => {
    setFormError(null);
    try {
      await authApi.resetPasswordConfirm({ email, ...values });
      showToast("Password updated — log in with your new password", "success");
      router.push("/login");
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't reach the server.",
      );
    }
  };

  const resend = async () => {
    setFormError(null);
    try {
      await authApi.forgotPassword({ email });
      setResent(true);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't reach the server.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-body text-neutral-600">
        We emailed a reset code to{" "}
        <span className="font-medium text-ink">{email}</span>.
      </p>
      <Input
        label="Reset code"
        inputMode="numeric"
        autoComplete="one-time-code"
        error={errors.otp?.message}
        {...register("otp")}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Reset password
      </Button>
      <button
        type="button"
        onClick={resend}
        className="text-center text-body-sm font-medium text-brand-600 transition-colors hover:underline"
      >
        {resent ? "Code resent — check your inbox" : "Didn't get a code? Resend"}
      </button>
    </form>
  );
}
