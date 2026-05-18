import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import postService from "../post.service";
import { PostGQLType } from "./post.type.gql";
import { Types } from "mongoose";

export const postMutationGql = {
  addPost: {
    type: PostGQLType,
    args: {
      content: { type: GraphQLString },
      attachments: { type: new GraphQLList(GraphQLString) },
      userId: { type: GraphQLString },
    },
    resolve: async (
      _: any,
      args: { content: string; attachments: string[]; userId: string },
    ) => {
      return await postService.create(args, new Types.ObjectId(args.userId));
    },
  },

  updatePost: {
    type: PostGQLType,
    args: {
      content: { type: GraphQLString },
      attachments: { type: new GraphQLList(GraphQLString) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
      postId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (
      _: any,
      args: {
        content: string;
        attachments: string[];
        userId: string;
        postId: string;
      },
    ) => {
      return await postService.update(
        new Types.ObjectId(args.postId),
        new Types.ObjectId(args.userId),
        args,
      );
    },
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      postId: { type: new GraphQLNonNull(GraphQLString) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_: any, args: { postId: string; userId: string }) => {
      const deletedCount = await postService.delete(
        new Types.ObjectId(args.postId),
        new Types.ObjectId(args.userId),
      );
      return !!deletedCount;
    },
  },
};
