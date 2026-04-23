import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE } from "../enums";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: SYS_ROLE;
  gender?: SYS_GENDER | undefined;
  provider: SYS_PROVIDER;
  profilePic: string;
}
