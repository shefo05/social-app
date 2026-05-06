"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodemailerProvider {
    _transporter;
    constructor(config) {
        this._transporter = nodemailer_1.default.createTransport({
            service: config.service,
            host: config.host,
            port: config.port,
            auth: {
                user: config.auth.user,
                pass: config.auth.password,
            },
        });
    }
    async send(to, subject, html) {
        await this._transporter.sendMail({ to, subject, html });
    }
}
exports.NodemailerProvider = NodemailerProvider;
