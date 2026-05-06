import { Types } from "mongoose";
import {
  requestRepo,
  RequestRepository,
} from "../../DB/models/request/request.repository";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../common";
import {
  userFriendRepo,
  UserFriendRepository,
} from "../../DB/models/user-friend/user-friend.repository";

class RequestService {
  constructor(
    private readonly _requestRepo: RequestRepository,
    private readonly _userFriendRepo: UserFriendRepository,
  ) {}

  async sendRequest(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
    if (senderId.toString() === receiverId.toString()) {
      throw new BadRequestException("you can't send request to yourself ");
    }

    const userFriendExist = await this._userFriendRepo.getOne({
      $or: [
        { user: senderId, friend: receiverId },
        { user: receiverId, friend: senderId },
      ],
    });
    if (userFriendExist)
      throw new BadRequestException("you are alredy friends");

    const requestExist = await this._requestRepo.getOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
    if (requestExist) throw new ConflictException("request already exists");

    return await this._requestRepo.create({
      sender: senderId,
      receiver: receiverId,
    });
  }

  async acceptRequest(userId: Types.ObjectId, id: Types.ObjectId) {
    const requestExist = await this._requestRepo.getOne({ _id: id });

    if (!requestExist)
      throw new NotFoundException("request is no longer exist");

    if (!requestExist.receiver.equals(userId)) {
      throw new UnauthorizedException(
        "you are not allowed to accept this request",
      );
    }

    await this._requestRepo.deleteOne({ _id: id });

    await this._userFriendRepo.create({
      user: userId,
      friend: requestExist.sender,
    });
  }

  async declineRequest(userId: Types.ObjectId, id: Types.ObjectId) {
    const requestExist = await this._requestRepo.getOne({ _id: id });
    if (!requestExist)
      throw new NotFoundException("request is no longer exist");

    if (
      !userId.equals(requestExist.sender) &&
      !userId.equals(requestExist.receiver)
    ) {
      throw new UnauthorizedException(
        "you are not allowed to decline this request",
      );
    }

    await this._requestRepo.deleteOne({ _id: id });
  }

  async declineRequest2(userId: Types.ObjectId, id: Types.ObjectId) {
    const { deletedCount } = await this._requestRepo.deleteOne({
      _id: id,
      $or: [{ sender: userId }, { receiver: userId }],
    });
    if (deletedCount == 0)
      throw new BadRequestException(
        "request is no longer exist or you are not authorized to decline this request",
      );
  }

  async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
    if (userId.equals(friendId))
      throw new BadRequestException("you are not allowed to remove yourself");
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
    if (deletedCount == 0) throw new BadRequestException("you are not friends");
  }
}

export default new RequestService(requestRepo, userFriendRepo);
