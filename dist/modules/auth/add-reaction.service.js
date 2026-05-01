"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReaction = void 0;
const common_1 = require("../../common");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
function toModel(collectionName) {
    switch (collectionName) {
        case "posts":
            return common_1.ON_MODEL.Post;
        case "comments":
            return common_1.ON_MODEL.Comment;
        default:
            throw new common_1.BadRequestException("invalid collection");
    }
}
const addReaction = async (addReactionDTO, userId, repo) => {
    const docExist = await repo.getOne({
        _id: addReactionDTO.id,
    });
    if (!docExist)
        throw new common_1.NotFoundException("post not found");
    const collectionName = docExist.collection.name;
    const userReactionRepo = new user_reaction_repository_1.UserReactionRepository();
    const userReaction = await userReactionRepo.getOne({
        onModel: toModel(collectionName),
        refId: addReactionDTO.id,
        userId,
    });
    if (!userReaction) {
        await userReactionRepo.create({
            onModel: toModel(collectionName),
            refId: addReactionDTO.id,
            userId,
            reaction: addReactionDTO.reaction,
        });
        await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: 1 } });
        return;
    }
    if (userReaction.reaction == addReactionDTO.reaction) {
        await userReactionRepo.deleteOne({ _id: userReaction._id });
        repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: -1 } });
        return;
    }
    await userReactionRepo.updateOne({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
    return;
};
exports.addReaction = addReaction;
