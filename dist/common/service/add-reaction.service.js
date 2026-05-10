"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReaction = void 0;
const mongoose_1 = require("mongoose");
const __1 = require("..");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
function toModel(collectionName) {
    switch (collectionName) {
        case "posts":
            return __1.ON_MODEL.Post;
        case "comments":
            return __1.ON_MODEL.Comment;
        default:
            throw new __1.BadRequestException("invalid collection");
    }
}
const addReaction = async (addReactionDTO, userId, repo, pushNotificationProvider, cacheProvider) => {
    const docExist = await repo.getOne({
        _id: addReactionDTO.id,
    });
    if (!docExist)
        throw new __1.NotFoundException(`${repo.model.modelName} not found`);
    const collectionName = docExist.collection.name;
    const userReactionRepo = new user_reaction_repository_1.UserReactionRepository();
    const modelId = new mongoose_1.Types.ObjectId(addReactionDTO.id);
    const userReaction = await userReactionRepo.getOne({
        onModel: toModel(collectionName),
        refId: modelId,
        userId,
    });
    // add new reaction
    if (!userReaction) {
        await userReactionRepo.create({
            onModel: toModel(collectionName),
            refId: modelId,
            userId,
            reaction: addReactionDTO.reaction,
        });
        await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: 1 } });
        const fcmTokens = await cacheProvider.getAllSet(`${docExist.userId.toString()}:FCM`);
        if (fcmTokens) {
            await pushNotificationProvider.sendAll(fcmTokens, {
                title: `your ${repo.model.modelName} you shared`,
                body: `${userId.toString()} has react to your ${repo.model.modelName} by ${addReactionDTO.reaction}`,
            });
        }
        return;
    }
    //remove reaction
    if (userReaction.reaction == addReactionDTO.reaction) {
        await userReactionRepo.deleteOne({ _id: userReaction._id });
        repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: -1 } });
        return;
    }
    //update reaction
    await userReactionRepo.updateOne({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
    const fcmTokens = await cacheProvider.getAllSet(`${docExist.userId.toString()}:FCM`);
    if (fcmTokens) {
        await pushNotificationProvider.sendAll(fcmTokens, {
            title: `your ${repo.model.modelName} you shared`,
            body: `${userId.toString()} has react to your ${repo.model.modelName} by ${addReactionDTO.reaction}`,
        });
    }
    return;
};
exports.addReaction = addReaction;
