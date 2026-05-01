"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const middleware_1 = require("../../middleware");
const comment_validation_1 = require("./comment.validation");
const mongoose_1 = require("mongoose");
const common_1 = require("../../common");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/add-reaction", middleware_1.isAuthenticated, async (req, res, next) => {
    await (0, common_1.addReaction)(req.body, req.user._id, comment_repository_1.commentRepo);
    return res.sendStatus(204);
});
router.post("{/:parentId}", (0, middleware_1.isvalid)(comment_validation_1.createCommentSchema), middleware_1.isAuthenticated, async (req, res, next) => {
    // console.log({ params: req.params });
    const createdComment = await comment_service_1.default.create(req.body, req.params, req.user._id);
    return res.status(201).json({
        success: true,
        data: { createdComment },
    });
});
router.get("/:postId{/:parentId}", async (req, res, next) => {
    const comments = await comment_service_1.default.getAll(req.params);
    res.status(200).json({
        success: true,
        data: { comments },
    });
});
router.delete("/:id", middleware_1.isAuthenticated, async (req, res, next) => {
    await comment_service_1.default.delete(new mongoose_1.Types.ObjectId(req.params.id), req.user._id);
    return res.sendStatus(204);
});
exports.default = router;
