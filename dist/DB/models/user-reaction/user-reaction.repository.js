"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReactionRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const user_reaction_model_1 = require("./user-reaction.model");
class UserReactionRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_reaction_model_1.UserReaction);
    }
}
exports.UserReactionRepository = UserReactionRepository;
