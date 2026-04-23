import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { SEND_MAIL_PASS, SEND_MAIL_USER } from "../../config";

export const sendMail = async ({ to, subject, html }:MailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: SEND_MAIL_USER,
      pass: SEND_MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Social App"<shafeelgendy@gmail.com>',
    to,
    subject,
    html,
  });
};
