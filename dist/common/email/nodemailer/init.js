"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodemailerProvider = void 0;
const config_1 = require("../../../config");
const nodemailer_service_1 = require("./nodemailer.service");
exports.nodemailerProvider = new nodemailer_service_1.NodemailerProvider({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: config_1.SEND_MAIL_USER,
        password: config_1.SEND_MAIL_PASS,
    },
});
