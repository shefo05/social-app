"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";
import { authApi } from "../api";
import { verifySchema, type VerifyFormValues } from "../schemas";

export function OtpForm({ email }: { email: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({ resolver: zodResolver(verifySchema) });

  const onSubmit = async (values: VerifyFormValues) => {
    setFormError(null);
    try {
      await authApi.verifyAccount({ email, otp: values.otp });
      router.push("/login?verified=1");
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't reach the server.",
      );
    }
  };

  const resend = async () => {
    setFormError(null);
    try {
      await authApi.sendOtp({ email });
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
        We emailed a verification code to{" "}
        <span className="font-medium text-ink">{email}</span>.
      </p>
      <Input
        label="Verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        error={errors.otp?.message}
        {...register("otp")}
      />
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting}>
        Verify account
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
