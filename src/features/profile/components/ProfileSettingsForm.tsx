"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { authApi } from "@/features/auth/api";
import { createAuthSchemas } from "@/features/auth/schemas";

export function ProfileSettingsForm() {
  const t = useTranslations("profile.settingsForm");
  const tValidation = useTranslations("validation");
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const showToast = useUiStore((s) => s.showToast);
  const [formError, setFormError] = useState<string | null>(null);

  const { userNameSchema, emailSchema, phoneNumberSchema } =
    createAuthSchemas(tValidation);
  const updateSchema = z.object({
    userName: z.union([userNameSchema, z.literal("")]),
    email: z.union([emailSchema, z.literal("")]),
    phoneNumber: z.union([phoneNumberSchema, z.literal("")]),
  });
  type UpdateFormValues = z.infer<typeof updateSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      userName: user?.userName ?? "",
      email: user?.email ?? "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: UpdateFormValues) => {
    setFormError(null);
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v),
    );
    try {
      const res = await authApi.updateProfile(payload);
      setUser(res.date.updatedUser);
      showToast(t("updated"), "success");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t("updateError"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label={t("fullName")}
        error={errors.userName?.message}
        {...register("userName")}
      />
      <Input
        label={t("email")}
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("phoneNumber")}
        placeholder={t("phonePlaceholder")}
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {t("submit")}
      </Button>
    </form>
  );
}
