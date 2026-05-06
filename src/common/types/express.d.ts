import { UserDocument } from "./user.type";

// export interface Request{
//     user: IUser;
// }

declare module "express-serve-static-core" {
  interface Request {
    user: UserDocument;
  }
}
