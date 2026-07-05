"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";
import { authApi } from "../api";
import { createAuthSchemas, type SignupFormValues } from "../schemas";

export function SignupForm() {
  const t = useTranslations("auth.signup");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const { signupSchema } = createAuthSchemas(tValidation);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    setFormError(null);
    try {
      await authApi.signup(values);
      router.push(`/verify?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.status === 409 ? t("emailTaken") : err.message);
      } else {
        setFormError(tCommon("unexpectedError"));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label={t("fullName")}
        autoComplete="name"
        error={errors.userName?.message}
        {...register("userName")}
      />
      <Input
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("phoneNumber")}
        type="tel"
        placeholder={t("phonePlaceholder")}
        autoComplete="tel"
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />
      <Input
        label={t("password")}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        {t("submit")}
      </Button>
      <p className="text-center text-body-sm text-neutral-500">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          {t("logIn")}
        </Link>
      </p>
    </form>
  );
}
