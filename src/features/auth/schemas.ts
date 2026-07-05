import { z } from "zod";
import type { useTranslations } from "next-intl";

type ValidationT = ReturnType<typeof useTranslations<"validation">>;

// Factory rather than static exports so every message can come from the
// "validation" i18n namespace - the regexes themselves mirror
// src/common/constant/validation.constant.ts on the backend so
// client-side validation never rejects (or accepts) something the API
// would disagree with, and don't need translating.
export function createAuthSchemas(t: ValidationT) {
  const emailSchema = z.string().email(t("email"));

  const passwordSchema = z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      t("password"),
    );

  const userNameSchema = z
    .string()
    .min(2, t("userNameMin"))
    .max(20, t("userNameMax"));

  const phoneNumberSchema = z
    .string()
    .regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/, t("phoneNumber"));

  const otpSchema = z.string().min(1, t("otp"));

  return {
    emailSchema,
    passwordSchema,
    userNameSchema,
    phoneNumberSchema,
    otpSchema,
    signupSchema: z.object({
      email: emailSchema,
      password: passwordSchema,
      userName: userNameSchema,
      phoneNumber: phoneNumberSchema,
    }),
    loginSchema: z.object({
      email: emailSchema,
      password: passwordSchema,
    }),
    verifySchema: z.object({
      otp: otpSchema,
    }),
    forgotPasswordSchema: z.object({
      email: emailSchema,
    }),
    resetPasswordConfirmSchema: z.object({
      otp: otpSchema,
      newPassword: passwordSchema,
    }),
  };
}

type AuthSchemas = ReturnType<typeof createAuthSchemas>;
export type SignupFormValues = z.infer<AuthSchemas["signupSchema"]>;
export type LoginFormValues = z.infer<AuthSchemas["loginSchema"]>;
export type VerifyFormValues = z.infer<AuthSchemas["verifySchema"]>;
export type ForgotPasswordFormValues = z.infer<AuthSchemas["forgotPasswordSchema"]>;
export type ResetPasswordConfirmFormValues = z.infer<
  AuthSchemas["resetPasswordConfirmSchema"]
>;
