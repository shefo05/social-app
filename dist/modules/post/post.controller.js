"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_service_1 = __importDefault(require("./post.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_validation_1 = require("./post.validation");
const middleware_1 = require("../../middleware");
const comment_controller_1 = __importDefault(require("../comment/comment.controller"));
const common_1 = require("../../common");
const post_repository_1 = require("../../DB/models/post/post.repository");
const init_1 = require("../../common/notification/firebase/init");
const init_2 = require("../../common/cache/redis/init");
const dto_1 = require("../../common/dto");
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
router.post("/add-reaction", (0, middleware_1.isvalid)(dto_1.AddReactionSchema), middleware_1.isAuthenticated, async (req, res, next) => {
    await (0, common_1.addReaction)(req.body, req.user._id, post_repository_1.postRepo, init_1.firebasePushNotificationProvider, init_2.redisCacheProvider);
    // await postService.addReaction(
    //   req.body,
    //   req.user._id,
    // );
    return res.sendStatus(204);
});
// get my posts and friend posts 
router.get("/feed", middleware_1.isAuthenticated, async (req, res, next) => {
    const query = post_validation_1.listPostsQuerySchema.parse(req.query);
    const feedPosts = await post_service_1.default.getFeed(req.user._id, query);
    return res.status(200).json({
        success: true,
        ...feedPosts,
    });
});
router.get("/me", middleware_1.isAuthenticated, async (req, res, next) => {
    const query = post_validation_1.listPostsQuerySchema.parse(req.query);
    const myPosts = await post_service_1.default.getMyPosts(req.user._id, query);
    return res.status(200).json({
        success: true,
        ...myPosts,
    });
});
router.get("/:id", async (req, res, next) => {
    if (!req.params.id) {
        throw new common_1.BadRequestException("send valid post ID");
    }
    const post = await post_service_1.default.getOne(new mongoose_1.default.Types.ObjectId(req.params.id));
    return res.status(200).json({
        success: true,
        data: post,
    });
});
router.patch("/:id", (0, middleware_1.isvalid)(post_validation_1.updatePostSchema), middleware_1.isAuthenticated, async (req, res, next) => {
    if (!req.params.id) {
        throw new common_1.BadRequestException("send valid post ID");
    }
    const post = await post_service_1.default.update(new mongoose_1.default.Types.ObjectId(req.params.id), req.user._id, req.body);
    return res.status(200).json({
        message: "post updated successfully",
        success: true,
        data: post,
    });
});
router.delete("/:id", middleware_1.isAuthenticated, async (req, res, next) => {
    if (!req.params.id) {
        throw new common_1.BadRequestException("send valid post ID");
    }
    const deletedCount = await post_service_1.default.delete(new mongoose_1.default.Types.ObjectId(req.params.id), req.user._id);
    return res.status(200).json({
        message: "post deleted successfully",
        success: true,
        data: deletedCount,
    });
});
exports.default = router;
