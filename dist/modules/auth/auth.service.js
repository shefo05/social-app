"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const jwt_utils_1 = require("../../common/utils/jwt.utils");
const user_repository_1 = require("../../DB/models/user/user.repository");
const redis_service_1 = require("../../DB/redis.service");
class AuthService {
    _userRepo;
    constructor(_userRepo) {
        this._userRepo = _userRepo;
    }
    async checkUserExist(filter) {
        return await this._userRepo.getOne(filter);
    }
    async signup(signupDTO) {
        let { email, password, phoneNumber } = signupDTO;
        const userExist = await this._userRepo.getOne({ email });
        if (userExist)
            throw new common_1.ConflictException("user already exist !");
        signupDTO.password = await (0, common_1.hash)(password);
        if (phoneNumber)
            signupDTO.phoneNumber = (0, common_1.encryption)(phoneNumber);
        const otp = (0, common_1.generateOTP)();
        (0, common_1.sendMail)({
            to: email,
            subject: "confirm email",
            html: `<p>your OTP to verify account is ${otp}</p>`,
        });
        await (0, redis_service_1.setIntoCache)(`${email}:otp`, otp, 3 * 60);
        await (0, redis_service_1.setIntoCache)(email, JSON.stringify(signupDTO), 3 * 24 * 60 * 60);
    }
    async verifyAccount(verifyAccoutDTO) {
        const { email } = verifyAccoutDTO;
        const userData = await (0, redis_service_1.getFromCache)(email);
        if (!userData)
            throw new common_1.NotFoundException("user not found !");
        const otp = await (0, redis_service_1.getFromCache)(`${email}:otp`);
        if (!otp)
            throw new common_1.BadRequestException("expired otp!");
        if (otp != verifyAccoutDTO.otp)
            throw new common_1.BadRequestException("invalid otp!");
        await this._userRepo.create(JSON.parse(userData));
        await (0, redis_service_1.deleteFromCache)(`${email}:otp`);
        await (0, redis_service_1.deleteFromCache)(email);
    }
    async sendOTP(sendOtpDTO) {
        const { email } = sendOtpDTO;
        const userExistDB = await this._userRepo.getOne({ email });
        const userExistCache = await (0, redis_service_1.getFromCache)(email);
        if (!userExistCache && !userExistDB)
            throw new common_1.NotFoundException("user not found");
        const otpExist = await (0, redis_service_1.getFromCache)(`${email}:otp`);
        if (otpExist)
            throw new common_1.BadRequestException("you already have a valid otp, wait 3 minutes");
        const otp = (0, common_1.generateOTP)();
        (0, common_1.sendMail)({
            to: email,
            subject: "send otp",
            html: `<p>your otp is ${otp}</p>`,
        });
        await (0, redis_service_1.setIntoCache)(`${email}:otp`, otp, 3 * 60);
    }
    async resetPassword(resetPasswordDTO, user) {
        const { newPassword } = resetPasswordDTO;
        const { email } = user;
        // const userExist = await this._userRepo.getOne({ email });
        // if (!userExist) throw new NotFoundException("user not found");
        const otp = await (0, redis_service_1.getFromCache)(`${email}:otp`);
        if (otp != resetPasswordDTO.otp)
            throw new common_1.BadRequestException("invalid OTP");
        const password = await (0, common_1.hash)(newPassword);
        await this._userRepo.updateOne({ email }, { password });
        await (0, redis_service_1.deleteFromCache)(`${email}:otp`);
    }
    async login(loginDTO) {
        const { email, password } = loginDTO;
        const DUMMY_HASH = "$2b$10$abcdefghijklmnopqrstuv1234567890abcdef";
        const userExist = await this._userRepo.getOne({ email });
        const hash = userExist?.password ?? DUMMY_HASH;
        const matchPassword = await (0, common_1.compare)(password, hash);
        if (!matchPassword || !userExist)
            throw new common_1.BadRequestException("invalid credentials");
        const payloadData = {
            sub: userExist._id.toString(),
        };
        return (0, jwt_utils_1.generateTokens)(payloadData);
    }
}
exports.default = new AuthService(new user_repository_1.UserRepository());
