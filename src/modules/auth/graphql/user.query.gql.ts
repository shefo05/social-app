import { Types } from "mongoose";
import authService from "../auth.service";
import { UserGQLType } from "./user.type.gql";

export const userGQLQuery = {
  user: {
    type: UserGQLType,
    resolve: async () => {
      return await authService.checkUserExist({
        _id: new Types.ObjectId("69f52a5c303f10a8dbbd7bdf"),
      });
    },
  },
};
