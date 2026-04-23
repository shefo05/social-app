"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const middleware_1 = require("../../middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post("/signup", (0, middleware_1.isvalid)(auth_validation_1.signupSchema), async (req, res, next) => {
    await auth_service_1.default.signup(req.body);
    return res.status(201).json({
        message: "user created successfully",
        success: true,
    });
});
router.post("/verify-account", async (req, res, next) => {
    await auth_service_1.default.verifyAccount(req.body);
    return res.status(200).json({
        message: "user verified successfully",
        success: true,
    });
});
router.post("/send-otp", async (req, res, next) => {
    await auth_service_1.default.sendOTP(req.body);
    return res.status(200).json({
        message: "OTP sent successfully",
        success: true,
    });
});
router.patch("/reset-password", async (req, res, next) => {
    await auth_service_1.default.resetPassword(req.body);
    return res.status(200).json({
        message: "password updated successfully",
        success: true,
    });
});
router.post("/login", async (req, res, next) => {
    const tokens = await auth_service_1.default.login(req.body);
    return res.status(200).json({
        message: "user loggedin successfully",
        success: true,
        data: tokens,
    });
});
exports.default = router;
