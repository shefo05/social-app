"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/utils";
import { authApi } from "../api";
import { createAuthSchemas, type VerifyFormValues } from "../schemas";

export function OtpForm({ email }: { email: string }) {
  const t = useTranslations("auth.verify");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const { verifySchema } = createAuthSchemas(tValidation);
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
      setFormError(getErrorMessage(err, tCommon("unexpectedError")));
    }
  };

  const resend = async () => {
    setFormError(null);
    try {
      await authApi.sendOtp({ email });
      setResent(true);
    } catch (err) {
      setFormError(getErrorMessage(err, tCommon("unexpectedError")));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-body text-neutral-600">
        {t("sentTo")} <span className="font-medium text-ink">{email}</span>.
      </p>
      <Input
        label={t("code")}
        inputMode="numeric"
        autoComplete="one-time-code"
        error={errors.otp?.message}
        {...register("otp")}
      />
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting}>
        {t("submit")}
      </Button>
      <button
        type="button"
        onClick={resend}
        className="text-center text-body-sm font-medium text-brand-600 transition-colors hover:underline"
      >
        {resent ? t("resent") : t("resend")}
      </button>
    </form>
  );
}
