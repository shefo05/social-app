import z from "zod";
import {
  loginSchema,
  resetPasswordSchema,
  sendOtpSchema,
  signupSchema,
  verifyAccountSchema,
} from "./auth.validation";

// export interface SignupDTO {
//   email: string;
//   password: string;
//   userName: string;
//   phoneNumber?: string;
//   gender: SYS_GENDER;
// }

export type SignupDTO = z.infer<typeof signupSchema>;

// export interface LoginDTO {
//   email: string;
//   password: string;
// }
export type LoginDTO = z.infer<typeof loginSchema>;

// export interface VerifyAccountDTO {
//   otp: string;
//   email: string;
// }
export type VerifyAccountDTO = z.infer<typeof verifyAccountSchema>;

// export interface SendOtpDTO {
//   email: string;
// }
export type SendOtpDTO = z.infer<typeof sendOtpSchema>;

// export interface ResetPasswordDTO {
//   otp: string;
//   newPassword: string;
// }
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
