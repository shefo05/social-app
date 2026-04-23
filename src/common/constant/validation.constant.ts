import z from "zod";
import { SYS_GENDER } from "../enums";

export const generalFields = {
  email: z.email(),
  gender: z.enum(SYS_GENDER).optional(),
  password: z
    .string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  userName: z.string().min(2).max(20),
  phoneNumber: z.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
};
