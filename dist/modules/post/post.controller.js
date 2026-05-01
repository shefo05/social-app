"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_service_1 = __importDefault(require("./post.service"));
const post_validation_1 = require("./post.validation");
const middleware_1 = require("../../middleware");
const comment_controller_1 = __importDefault(require("../comment/comment.controller"));
const common_1 = require("../../common");
const post_repository_1 = require("../../DB/models/post/post.repository");
const router = (0, express_1.Router)();
router.use("/:postId/comment", comment_controller_1.default);
router.post("/", (0, middleware_1.isvalid)(post_validation_1.createPostSchema), middleware_1.isAuthenticated, async (req, res, next) => {
    const createdPost = await post_service_1.default.create(req.body, req.user._id);
    return res.status(201).json({
        message: "post created successfully",
        success: true,
        data: { createdPost },
    });
});
router.post("/add-reaction", middleware_1.isAuthenticated, async (req, res, next) => {
    await (0, common_1.addReaction)(req.body, req.user._id, post_repository_1.postRepo);
    // await postService.addReaction(
    //   req.body,
    //   req.user._id,
    // );
    return res.sendStatus(204);
});
exports.default = router;
