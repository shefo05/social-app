"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";
import { authApi } from "../api";
import { createAuthSchemas, type LoginFormValues } from "../schemas";
import { useCompleteAuth } from "../hooks/useCompleteAuth";
import { GoogleButton } from "./GoogleButton";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tGoogle = useTranslations("auth.google");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const completeAuth = useCompleteAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const { loginSchema } = createAuthSchemas(tValidation);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const loginRes = await authApi.login(values);
      await completeAuth(loginRes.data);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : tCommon("unexpectedError"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("password")}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Link
        href="/forgot-password"
        className="-mt-2 self-end text-body-sm font-medium text-brand-600 hover:underline"
      >
        {t("forgotPassword")}
      </Link>
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        {t("submit")}
      </Button>
      <div className="flex items-center gap-3 text-body-sm text-neutral-400">
        <span className="h-px flex-1 bg-neutral-200" />
        {tGoogle("orDivider")}
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
      <GoogleButton />
      <p className="text-center text-body-sm text-neutral-500">
        {t("newHere")}{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
