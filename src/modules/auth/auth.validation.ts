import z from "zod";
import { generalFields as GF } from "../../common";

export const signupSchema = z.object({
  email: GF.email,
  gender: GF.gender,
  password: GF.password,
  userName: GF.userName,
  phoneNumber: GF.phoneNumber,
});

export const loginSchema = z.object({
  email: GF.email,
  password: GF.password,
});

export const forgetPasswordSchema = {};
