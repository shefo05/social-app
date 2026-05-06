import { Types } from "mongoose";

export interface IRequest {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
}
