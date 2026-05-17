import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { UserGQLType } from "../../auth/graphql/user.type.gql";

export const PostGQLType = new GraphQLObjectType({
  name: "PostType",
  fields: {
    _id: { type: GraphQLID },
    content: { type: GraphQLString },
    attachments: { type: new GraphQLList(GraphQLString) },
    reactionsCount: { type: GraphQLInt },
    commentsCount: { type: GraphQLInt },
    sharesCount: { type: GraphQLInt },
    user: {
      type: UserGQLType,
      resolve: (parent: any) => {
        return parent.userId;
      },
    },
  },
});
