"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    async sendRequest(senderId, receiverId) {
        if (senderId.toString() === receiverId.toString()) {
            throw new common_1.BadRequestException("you can't send request to yourself ");
        }
        const userFriendExist = await this._userFriendRepo.getOne({
            $or: [
                { user: senderId, friend: receiverId },
                { user: receiverId, friend: senderId },
            ],
        });
        if (userFriendExist)
            throw new common_1.BadRequestException("you are alredy friends");
        const requestExist = await this._requestRepo.getOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });
        if (requestExist)
            throw new common_1.ConflictException("request already exists");
        return await this._requestRepo.create({
            sender: senderId,
            receiver: receiverId,
        });
    }
    async acceptRequest(userId, id) {
        const requestExist = await this._requestRepo.getOne({ _id: id });
        if (!requestExist)
            throw new common_1.NotFoundException("request is no longer exist");
        if (!requestExist.receiver.equals(userId)) {
            throw new common_1.UnauthorizedException("you are not allowed to accept this request");
        }
        await this._requestRepo.deleteOne({ _id: id });
        await this._userFriendRepo.create({
            user: userId,
            friend: requestExist.sender,
        });
    }
    async declineRequest(userId, id) {
        const requestExist = await this._requestRepo.getOne({ _id: id });
        if (!requestExist)
            throw new common_1.NotFoundException("request is no longer exist");
        if (!userId.equals(requestExist.sender) &&
            !userId.equals(requestExist.receiver)) {
            throw new common_1.UnauthorizedException("you are not allowed to decline this request");
        }
        await this._requestRepo.deleteOne({ _id: id });
    }
    async declineRequest2(userId, id) {
        const { deletedCount } = await this._requestRepo.deleteOne({
            _id: id,
            $or: [{ sender: userId }, { receiver: userId }],
        });
        if (deletedCount == 0)
            throw new common_1.BadRequestException("request is no longer exist or you are not authorized to decline this request");
    }
    async removeFriend(userId, friendId) {
        if (userId.equals(friendId))
            throw new common_1.BadRequestException("you are not allowed to remove yourself");
        const { deletedCount } = await this._userFriendRepo.deleteOne({
            $or: [
                {
                    user: userId,
                    friend: friendId,
                },
                {
                    user: friendId,
                    friend: userId,
                },
            ],
        });
        if (deletedCount == 0)
            throw new common_1.BadRequestException("you are not friends");
    }
}
exports.default = new RequestService(request_repository_1.requestRepo, user_friend_repository_1.userFriendRepo);
