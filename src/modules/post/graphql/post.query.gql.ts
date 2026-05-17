import { Types } from "mongoose";
import postService from "../post.service";
import { PostGQLType } from "./post.type.gql";

export const postGQLQuery = {
  post: {
    type: PostGQLType,
    resolve: async () => {
      return await postService.getOne(
        new Types.ObjectId("69f5396cdbf357b59a12b3cd"),
      );
    },
  },
};
