import nodemailer, { Transporter } from "nodemailer";
import { IMailProvider } from "../mail.interface";

interface NodemailerConfig {
  service: string;
  host: string;
  port: number;
  auth: { user: string; password: string };
}

export class NodemailerProvider implements IMailProvider {
  private _transporter: Transporter;
  constructor(config: NodemailerConfig) {
    this._transporter = nodemailer.createTransport({
      service: config.service,
      host: config.host,
      port: config.port,
      auth: {
        user: config.auth.user,
        pass: config.auth.password,
      },
    });
  }
  async send(to: string, subject: string, html: string) {
    await this._transporter.sendMail({ to, subject, html });
  }
}
