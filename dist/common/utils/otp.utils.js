"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
function generateOTP() {
    const minNum = 100000;
    const maxNum = 900000;
    return Math.floor(Math.random() * maxNum + minNum);
}
