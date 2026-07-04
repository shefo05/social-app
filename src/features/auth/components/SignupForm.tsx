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
import { signupSchema, type SignupFormValues } from "../schemas";

export function SignupForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

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
        setFormError(
          err.status === 409
            ? "An account with that email already exists."
            : err.message,
        );
      } else {
        setFormError("Couldn't reach the server. Try again in a moment.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full name"
        autoComplete="name"
        error={errors.userName?.message}
        {...register("userName")}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Phone number"
        type="tel"
        placeholder="01xxxxxxxxx"
        autoComplete="tel"
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Create account
      </Button>
      <p className="text-center text-body-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
