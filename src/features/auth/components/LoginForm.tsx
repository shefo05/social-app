"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { authApi } from "../api";
import { createAuthSchemas, type LoginFormValues } from "../schemas";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
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
      // Login only returns tokens, not the user - stash the tokens first
      // so the follow-up /user/ call can authenticate, then fill in user.
      useAuthStore.setState({
        accessToken: loginRes.data.accessToken,
        refreshToken: loginRes.data.refreshToken,
      });
      const me = await authApi.getMe();
      useAuthStore.getState().setSession(me.data.user, loginRes.data);
      showToast(t("welcomeBack", { name: me.data.user.userName }), "success");
      router.replace("/feed");
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
      <p className="text-center text-body-sm text-neutral-500">
        {t("newHere")}{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
