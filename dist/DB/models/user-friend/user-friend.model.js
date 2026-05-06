"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFriend = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const schema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    friend: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    relationship: { type: String, enum: common_1.SYS_USER_RELATION },
    closeFriend: { type: Boolean, default: false },
}, { timestamps: true });
exports.UserFriend = (0, mongoose_1.model)("UserFriend", schema);
