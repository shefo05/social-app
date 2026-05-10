"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebasePushNotificationProvider = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class FirebasePushNotificationProvider {
    _client;
    constructor(config) {
        this._client = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(config),
        });
    }
    async send(token, data) {
        await this._client.messaging().send({ token, data });
    }
    async sendAll(tokens, data) {
        // for (const token of tokens) {
        //   await this.send(token, data);
        // }
        await Promise.all(tokens.map((token) => this.send(token, data)));
    }
}
exports.FirebasePushNotificationProvider = FirebasePushNotificationProvider;
