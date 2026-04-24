import { model, Schema } from "mongoose";
import { IPost } from "../../../common";

const schema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
        },
      content:String,
  },
  {
    timestamps: true,
  },
);

export const Post = model<IPost>("Post", schema);
