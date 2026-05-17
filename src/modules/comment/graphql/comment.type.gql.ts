import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { UserGQLType } from "../../auth/graphql/user.type.gql";
import { PostGQLType } from "../../post/graphql/post.type.gql";

export const CommentGQLType = new GraphQLObjectType({
  name: "CommentType",
  fields: {
    user: {
      type: UserGQLType,
      resolve: (parent: any) => {
        return parent.userId;
      },
    },
    post: {
      type: PostGQLType,
      resolve: (parent: any) => {
        return parent.postId;
      },
    },
    content: { type: GraphQLString },
    attachment: { type: GraphQLString },
    mentions: { type: new GraphQLList(UserGQLType) },
    reactionsCount: { type: GraphQLInt },
  },
});
