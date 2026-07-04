import { z } from "zod";

// Mirrors src/common/constant/validation.constant.ts on the backend so
// client-side validation never rejects (or accepts) something the API
// would disagree with.
export const emailSchema = z.string().email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    "At least 8 characters, with an uppercase and lowercase letter, a number, and a symbol",
  );

export const userNameSchema = z
  .string()
  .min(2, "Must be at least 2 characters")
  .max(20, "Must be 20 characters or fewer");

export const phoneNumberSchema = z
  .string()
  .regex(
    /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/,
    "Enter a valid Egyptian phone number",
  );

export const otpSchema = z.string().min(1, "Enter the code we emailed you");

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userName: userNameSchema,
  phoneNumber: phoneNumberSchema,
});
export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const verifySchema = z.object({
  otp: otpSchema,
});
export type VerifyFormValues = z.infer<typeof verifySchema>;
