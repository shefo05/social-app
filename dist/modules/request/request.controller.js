"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const request_service_1 = __importDefault(require("./request.service"));
const request_validation_1 = require("./request.validation");
const router = (0, express_1.Router)();
router.get("/dashboard", middleware_1.isAuthenticated, async (req, res, next) => {
    const query = request_validation_1.requestDashboardQuerySchema.parse(req.query);
    const dashboard = await request_service_1.default.getDashboard(req.user._id, query);
    return res.status(200).json({
        success: true,
        data: dashboard,
    });
});
router.post("/:receiverId", middleware_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.sendRequest(req.user._id, req.params.receiverId);
    return res.sendStatus(204);
});
router.post("/accept/:id", middleware_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.acceptRequest(req.user._id, req.params.id);
    return res.sendStatus(204);
});
router.post("/decline/:id", middleware_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.declineRequest2(req.user._id, req.params.id);
    return res.sendStatus(204);
});
router.delete("/remove/:friendId", middleware_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.removeFriend(req.user._id, req.params.friendId);
    return res.sendStatus(204);
});
exports.default = router;
