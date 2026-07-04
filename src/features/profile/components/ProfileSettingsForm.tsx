"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { authApi } from "@/features/auth/api";
import {
  userNameSchema,
  emailSchema,
  phoneNumberSchema,
} from "@/features/auth/schemas";

const updateSchema = z.object({
  userName: z.union([userNameSchema, z.literal("")]),
  email: z.union([emailSchema, z.literal("")]),
  phoneNumber: z.union([phoneNumberSchema, z.literal("")]),
});
type UpdateFormValues = z.infer<typeof updateSchema>;

export function ProfileSettingsForm() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const showToast = useUiStore((s) => s.showToast);
  const [formError, setFormError] = useState<string | null>(null);

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
      showToast("Profile updated", "success");
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't save changes.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full name"
        error={errors.userName?.message}
        {...register("userName")}
      />
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Phone number"
        placeholder="01xxxxxxxxx"
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />
      {formError && <p className="text-body-sm text-danger">{formError}</p>}
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Save changes
      </Button>
    </form>
  );
}
