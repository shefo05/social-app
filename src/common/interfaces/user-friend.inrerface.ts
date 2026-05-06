import { Types } from "mongoose";
import { SYS_USER_RELATION } from "../enums";

export interface IUserFriend {
  user: Types.ObjectId;
  friend: Types.ObjectId;
  closeFriend: boolean;
  relationship: SYS_USER_RELATION;
}
