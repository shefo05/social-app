"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const request_repository_1 = require("../../DB/models/request/request.repository");
const common_1 = require("../../common");
const user_friend_repository_1 = require("../../DB/models/user-friend/user-friend.repository");
class RequestService {
    _requestRepo;
    _userFriendRepo;
    constructor(_requestRepo, _userFriendRepo) {
        this._requestRepo = _requestRepo;
        this._userFriendRepo = _userFriendRepo;
    }
    async sendRequest(sender, receiverId) {
        const receiver = new mongoose_1.default.Types.ObjectId(receiverId);
        if (sender.toString() === receiver.toString()) {
            throw new common_1.BadRequestException("you can't send request to yourself ");
        }
        const userFriendExist = await this._userFriendRepo.getOne({
            $or: [
                { user: sender, friend: receiver },
                { user: receiver, friend: sender },
            ],
        });
        if (userFriendExist)
            throw new common_1.BadRequestException("you are alredy friends");
        const requestExist = await this._requestRepo.getOne({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender },
            ],
        });
        if (requestExist)
            throw new common_1.ConflictException("request already exists");
        return await this._requestRepo.create({
            sender,
            receiver,
        });
    }
    async acceptRequest(userId, id) {
        const reqId = new mongoose_1.default.Types.ObjectId(id);
        const requestExist = await this._requestRepo.getOne({ _id: reqId });
        if (!requestExist)
            throw new common_1.NotFoundException("request is no longer exist");
        if (!requestExist.receiver.equals(userId)) {
            throw new common_1.UnauthorizedException("you are not allowed to accept this request");
        }
        await this._requestRepo.deleteOne({ _id: reqId });
        await this._userFriendRepo.create({
            user: userId,
            friend: requestExist.sender,
        });
    }
    async declineRequest(userId, id) {
        const reqId = new mongoose_1.default.Types.ObjectId(id);
        const requestExist = await this._requestRepo.getOne({ _id: reqId });
        if (!requestExist)
            throw new common_1.NotFoundException("request is no longer exist");
        if (!userId.equals(requestExist.sender) &&
            !userId.equals(requestExist.receiver)) {
            throw new common_1.UnauthorizedException("you are not allowed to decline this request");
        }
        await this._requestRepo.deleteOne({ _id: reqId });
    }
    async declineRequest2(userId, id) {
        const reqId = new mongoose_1.default.Types.ObjectId(id);
        const { deletedCount } = await this._requestRepo.deleteOne({
            _id: reqId,
            $or: [{ sender: userId }, { receiver: userId }],
        });
        if (deletedCount == 0)
            throw new common_1.BadRequestException("request is no longer exist or you are not authorized to decline this request");
    }
    async removeFriend(userId, friendId) {
        const friend = new mongoose_1.default.Types.ObjectId(friendId);
        if (userId.equals(friend))
            throw new common_1.BadRequestException("you are not allowed to remove yourself");
        const { deletedCount } = await this._userFriendRepo.deleteOne({
            $or: [
                {
                    user: userId,
                    friend: friend,
                },
                {
                    user: friend,
                    friend: userId,
                },
            ],
        });
        if (deletedCount == 0)
            throw new common_1.BadRequestException("you are not friends");
    }
    async getDashboard(userId, query) {
        const [incomingCount, outgoingCount, incomingRecent, outgoingRecent] = await Promise.all([
            this._requestRepo.model.countDocuments({ receiver: userId }),
            this._requestRepo.model.countDocuments({ sender: userId }),
            this._requestRepo.getAll({ receiver: userId }, {}, {
                sort: { createdAt: -1 },
                limit: query.limit,
            }),
            this._requestRepo.getAll({ sender: userId }, {}, {
                sort: { createdAt: -1 },
                limit: query.limit,
            }),
        ]);
        return {
            incomingCount,
            outgoingCount,
            incomingRecent,
            outgoingRecent,
        };
    }
}
exports.default = new RequestService(request_repository_1.requestRepo, user_friend_repository_1.userFriendRepo);
