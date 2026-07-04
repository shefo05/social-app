"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";
import { authApi } from "../api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null);
    try {
      await authApi.forgotPassword(values);
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't reach the server.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-body text-neutral-600">
        Enter the email on your account and we&apos;ll send you a code to
        reset your password.
      </p>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Send reset code
      </Button>
      <p className="text-center text-body-sm text-neutral-500">
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
