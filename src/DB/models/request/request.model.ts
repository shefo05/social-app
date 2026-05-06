import { model, Schema } from "mongoose";
import { IRequest } from "../../../common";

const schema = new Schema<IRequest>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true },
  },
);

export const Request = model("Request", schema);
