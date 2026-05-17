import { Types } from "mongoose";
import commentService from "../comment.service";
import { CommentGQLType } from "./comment.type.gql";

export const commentGQLQuery = {
  comment: {
    type: CommentGQLType,
    resolve: async () => {
      return await commentService.getOne({
        _id: new Types.ObjectId("6a090a28d37bd0f329880b26"),
      });
    },
  },
};
