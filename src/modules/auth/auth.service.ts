import { JwtPayload } from "jsonwebtoken";
import {
  BadRequestException,
  compare,
  ConflictException,
  encryption,
  generateOTP,
  hash,
  IUser,
  NotFoundException,
  sendMail,
} from "../../common";
import { generateTokens } from "../../common/utils/jwt.utils";
import { UserRepository } from "../../DB/models/user/user.repository";
import {
  deleteFromCache,
  getFromCache,
  setIntoCache,
} from "../../DB/redis.service";
import {
  LoginDTO,
  ResetPasswordDTO,
  SendOtpDTO,
  SignupDTO,
  VerifyAccountDTO,
} from "./auth.dto";
import { QueryFilter, Types } from "mongoose";

class AuthService {
  constructor(private _userRepo: UserRepository) {}

  async checkUserExist(filter: QueryFilter<IUser>) {
    return await this._userRepo.getOne(filter);
  }

  async signup(signupDTO: SignupDTO) {
    let { email, password, phoneNumber } = signupDTO;
    const userExist = await this._userRepo.getOne({ email });

    if (userExist) throw new ConflictException("user already exist !");
    signupDTO.password = await hash(password);

    if (phoneNumber) signupDTO.phoneNumber = encryption(phoneNumber);

    const otp = generateOTP();

    sendMail({
      to: email,
      subject: "confirm email",
      html: `<p>your OTP to verify account is ${otp}</p>`,
    });

    await setIntoCache(`${email}:otp`, otp, 3 * 60);

    await setIntoCache(email, JSON.stringify(signupDTO), 3 * 24 * 60 * 60);
  }

  async verifyAccount(verifyAccoutDTO: VerifyAccountDTO) {
    const { email } = verifyAccoutDTO;
    const userData = await getFromCache(email);
    if (!userData) throw new NotFoundException("user not found !");

    const otp = await getFromCache(`${email}:otp`);
    if (!otp) throw new BadRequestException("expired otp!");

    if (otp != verifyAccoutDTO.otp)
      throw new BadRequestException("invalid otp!");

    await this._userRepo.create(JSON.parse(userData));

    await deleteFromCache(`${email}:otp`);
    await deleteFromCache(email);
  }

  async sendOTP(sendOtpDTO: SendOtpDTO) {
    const { email } = sendOtpDTO;
    const userExistDB = await this._userRepo.getOne({ email });

    const userExistCache = await getFromCache(email);

    if (!userExistCache && !userExistDB)
      throw new NotFoundException("user not found");

    const otpExist = await getFromCache(`${email}:otp`);
    if (otpExist)
      throw new BadRequestException(
        "you already have a valid otp, wait 3 minutes",
      );
    const otp = generateOTP();
    sendMail({
      to: email,
      subject: "send otp",
      html: `<p>your otp is ${otp}</p>`,
    });
    await setIntoCache(`${email}:otp`, otp, 3 * 60);
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO, user: IUser) {
    const { newPassword } = resetPasswordDTO;
    const { email } = user;
    // const userExist = await this._userRepo.getOne({ email });

    // if (!userExist) throw new NotFoundException("user not found");

    const otp = await getFromCache(`${email}:otp`);
    if (otp != resetPasswordDTO.otp)
      throw new BadRequestException("invalid OTP");

    const password = await hash(newPassword);
    await this._userRepo.updateOne({ email }, { password });

    await deleteFromCache(`${email}:otp`);
  }

  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
    const DUMMY_HASH = "$2b$10$abcdefghijklmnopqrstuv1234567890abcdef";

    const userExist = await this._userRepo.getOne({ email });

    const hash = userExist?.password ?? DUMMY_HASH;
    const matchPassword = await compare(password, hash);

    if (!matchPassword || !userExist)
      throw new BadRequestException("invalid credentials");

    const payloadData: JwtPayload = {
      sub: userExist._id.toString(),
    };
    return generateTokens(payloadData);
  }
}

export default new AuthService(new UserRepository());
