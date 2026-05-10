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
router.post("/verify-account", (0, middleware_1.isvalid)(auth_validation_1.verifyAccountSchema), async (req, res, next) => {
    await auth_service_1.default.verifyAccount(req.body);
    return res.status(200).json({
        message: "user verified successfully",
        success: true,
    });
});
router.post("/send-otp", (0, middleware_1.isvalid)(auth_validation_1.sendOtpSchema), async (req, res, next) => {
    await auth_service_1.default.sendOTP(req.body);
    return res.status(200).json({
        message: "OTP sent successfully",
        success: true,
    });
});
router.patch("/reset-password", (0, middleware_1.isvalid)(auth_validation_1.resetPasswordSchema), middleware_1.isAuthenticated, async (req, res, next) => {
    await auth_service_1.default.resetPassword(req.body, req.user);
    return res.status(200).json({
        message: "password updated successfully",
        success: true,
    });
});
router.post("/login", (0, middleware_1.isvalid)(auth_validation_1.loginSchema), async (req, res, next) => {
    const tokens = await auth_service_1.default.login(req.body);
    return res.status(200).json({
        message: "user loggedin successfully",
        success: true,
        data: tokens,
    });
});
router.patch("/update", (0, middleware_1.isvalid)(auth_validation_1.updateUserSchema), middleware_1.isAuthenticated, async (req, res, next) => {
    const updatedUser = await auth_service_1.default.update(req.user._id, req.body);
    return res.status(200).json({
        message: "password updated successfully",
        success: true,
        date: { updatedUser },
    });
});
router.post("/logout", middleware_1.isAuthenticated, async (req, res, next) => {
    await auth_service_1.default.logout(req.user._id, "");
    return res.sendStatus(204);
});
router.delete("/", middleware_1.isAuthenticated, async (req, res, next) => {
    await auth_service_1.default.delete(req.user._id);
    return res.sendStatus(204);
});
exports.default = router;
