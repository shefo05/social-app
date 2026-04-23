"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryption = encryption;
exports.decryption = decryption;
const node_crypto_1 = __importDefault(require("node:crypto"));
function encryption(plainText) {
    const iv = node_crypto_1.default.randomBytes(16);
    const cipher = node_crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from("12345678123456781234567812345678"), iv);
    let encryptedData = cipher.update(plainText, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return `${iv.toString("hex")}:${encryptedData}`;
}
function decryption(encryptedData) {
    const [iv, encryptedValue] = encryptedData.split(":");
    const ivBufferLike = Buffer.from(iv, "hex");
    const decipher = node_crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from("12345678123456781234567812345678"), ivBufferLike);
    let decryptedValue = decipher.update(encryptedValue, "hex", "utf-8");
    decryptedValue += decipher.final("utf-8");
    return decryptedValue;
}
