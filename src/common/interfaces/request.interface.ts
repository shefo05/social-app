import { IUser } from "./user.interface";

// export interface Request{
//     user: IUser;
// }

declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
  }
}
