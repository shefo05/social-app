"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config");
const sendMail = async ({ to, subject, html }) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: config_1.SEND_MAIL_USER,
            pass: config_1.SEND_MAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: '"Social App"<shafeelgendy@gmail.com>',
        to,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
