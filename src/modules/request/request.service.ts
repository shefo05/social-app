import mongoose from "mongoose";
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
import { RequestDashboardQueryDTO } from "./request.dto";


class RequestService {
  constructor(
    private readonly _requestRepo: RequestRepository,
    private readonly _userFriendRepo: UserFriendRepository,
  ) {}

  async sendRequest(sender: mongoose.Types.ObjectId, receiverId: string) {
    const receiver = new mongoose.Types.ObjectId(receiverId);

    if (sender.toString() === receiver.toString()) {
      throw new BadRequestException("you can't send request to yourself ");
    }

    const userFriendExist = await this._userFriendRepo.getOne({
      $or: [
        { user: sender, friend: receiver },
        { user: receiver, friend: sender },
      ],
    });
    if (userFriendExist)
      throw new BadRequestException("you are alredy friends");

    const requestExist = await this._requestRepo.getOne({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    });
    if (requestExist) throw new ConflictException("request already exists");

    return await this._requestRepo.create({
      sender,
      receiver,
    });
  }

  async acceptRequest(userId: mongoose.Types.ObjectId, id: string) {
    const reqId = new mongoose.Types.ObjectId(id);

    const requestExist = await this._requestRepo.getOne({ _id: reqId });

    if (!requestExist)
      throw new NotFoundException("request is no longer exist");

    if (!requestExist.receiver.equals(userId)) {
      throw new UnauthorizedException(
        "you are not allowed to accept this request",
      );
    }

    await this._requestRepo.deleteOne({ _id: reqId });

    await this._userFriendRepo.create({
      user: userId,
      friend: requestExist.sender,
    });
  }

  async declineRequest(userId: mongoose.Types.ObjectId, id: string) {
    const reqId = new mongoose.Types.ObjectId(id);

    const requestExist = await this._requestRepo.getOne({ _id: reqId });
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

    await this._requestRepo.deleteOne({ _id: reqId });
  }

  async declineRequest2(userId: mongoose.Types.ObjectId, id: string) {
    const reqId = new mongoose.Types.ObjectId(id);

    const { deletedCount } = await this._requestRepo.deleteOne({
      _id: reqId,
      $or: [{ sender: userId }, { receiver: userId }],
    });
    if (deletedCount == 0)
      throw new BadRequestException(
        "request is no longer exist or you are not authorized to decline this request",
      );
  }

  async removeFriend(userId: mongoose.Types.ObjectId, friendId: string) {
    const friend = new mongoose.Types.ObjectId(friendId);

    if (userId.equals(friend))
      throw new BadRequestException("you are not allowed to remove yourself");
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
    if (deletedCount == 0) throw new BadRequestException("you are not friends");
  }

  async getDashboard(
    userId: mongoose.Types.ObjectId,
    query: RequestDashboardQueryDTO,
  ) {
    const [incomingCount, outgoingCount, incomingRecent, outgoingRecent] =
      await Promise.all([
        this._requestRepo.model.countDocuments({ receiver: userId }),
        this._requestRepo.model.countDocuments({ sender: userId }),
        this._requestRepo.getAll(
          { receiver: userId },
          {},
          {
            sort: { createdAt: -1 },
            limit: query.limit,
          },
        ),
        this._requestRepo.getAll(
          { sender: userId },
          {},
          {
            sort: { createdAt: -1 },
            limit: query.limit,
          },
        ),
      ]);

    return {
      incomingCount,
      outgoingCount,
      incomingRecent,
      outgoingRecent,
    };
  }
}

export default new RequestService(requestRepo, userFriendRepo);
