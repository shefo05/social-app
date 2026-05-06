import { SEND_MAIL_PASS, SEND_MAIL_USER } from "../../../config";
import { NodemailerProvider } from "./nodemailer.service";

export const nodemailerProvider = new NodemailerProvider({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: SEND_MAIL_USER as string,
    password: SEND_MAIL_PASS as string,
  },
});
