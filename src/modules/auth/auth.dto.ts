import z from "zod";
import { loginSchema, signupSchema } from "./auth.validation";

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

export interface VerifyAccountDTO {
  otp: string;
  email: string;
}

export interface SendOtpDTO {
  email: string;
}
export interface ResetPasswordDTO {
  otp: string;
  email: string;
  newPassword: string;
}

export interface ResetPasswordDTO {
  password: string;
  email: string;
}
