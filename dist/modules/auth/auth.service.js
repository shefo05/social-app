"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const jwt_utils_1 = require("../../common/utils/jwt.utils");
const user_repository_1 = require("../../DB/models/user/user.repository");
const init_1 = require("../../common/cache/redis/init");
const post_repository_1 = require("../../DB/models/post/post.repository");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
class AuthService {
    _userRepo;
    _postRepo;
    _commentRepo;
    _mailProvider;
    _cacheProvider;
    constructor(_userRepo, _postRepo, _commentRepo, _mailProvider, _cacheProvider) {
        this._userRepo = _userRepo;
        this._postRepo = _postRepo;
        this._commentRepo = _commentRepo;
        this._mailProvider = _mailProvider;
        this._cacheProvider = _cacheProvider;
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
        await this._mailProvider.send(email, "confirm email", `<p>your OTP to verify account is ${otp}</p>`);
        // sendMail({
        //   to: email,
        //   subject: "confirm email",
        //   html: `<p>your OTP to verify account is ${otp}</p>`,
        // });
        // await setIntoCache(`${email}:otp`, otp, 3 * 60);
        await this._cacheProvider.set(`${email}:otp`, otp, 3 * 60);
        // await setIntoCache(email, JSON.stringify(signupDTO), 3 * 24 * 60 * 60);
        await this._cacheProvider.set(email, JSON.stringify(signupDTO), 3 * 24 * 60 * 60);
    }
    async verifyAccount(verifyAccoutDTO) {
        const { email } = verifyAccoutDTO;
        // const userData = await getFromCache(email);
        const userData = await this._cacheProvider.get(email);
        if (!userData)
            throw new common_1.NotFoundException("user not found !");
        // const otp = await getFromCache(`${email}:otp`);
        const otp = await this._cacheProvider.get(`${email}:otp`);
        if (!otp)
            throw new common_1.BadRequestException("expired otp!");
        if (otp != verifyAccoutDTO.otp)
            throw new common_1.BadRequestException("invalid otp!");
        await this._userRepo.create(JSON.parse(userData));
        // await deleteFromCache(`${email}:otp`);
        await this._cacheProvider.delete(`${email}:otp`);
        // await deleteFromCache(email);
        await this._cacheProvider.delete(email);
    }
    async sendOTP(sendOtpDTO) {
        const { email } = sendOtpDTO;
        const userExistDB = await this._userRepo.getOne({ email });
        // const userExistCache = await getFromCache(email);
        const userExistCache = await this._cacheProvider.get(email);
        if (!userExistCache && !userExistDB)
            throw new common_1.NotFoundException("user not found");
        // const otpExist = await getFromCache(`${email}:otp`);
        const otpExist = await this._cacheProvider.get(`${email}:otp`);
        if (otpExist)
            throw new common_1.BadRequestException("you already have a valid otp, wait 3 minutes");
        const otp = (0, common_1.generateOTP)();
        await this._mailProvider.send(email, "confirm email", `<p>your OTP to verify account is ${otp}</p>`);
        // sendMail({
        //   to: email,
        //   subject: "send otp",
        //   html: `<p>your otp is ${otp}</p>`,
        // });
        // await setIntoCache(`${email}:otp`, otp, 3 * 60);
        await this._cacheProvider.set(`${email}:otp`, otp, 3 * 60);
    }
    async resetPassword(resetPasswordDTO, user) {
        const { newPassword } = resetPasswordDTO;
        const { email } = user;
        // const userExist = await this._userRepo.getOne({ email });
        // if (!userExist) throw new NotFoundException("user not found");
        // const otp = await getFromCache(`${email}:otp`);
        const otp = await this._cacheProvider.get(`${email}:otp`);
        if (otp != resetPasswordDTO.otp)
            throw new common_1.BadRequestException("invalid OTP");
        const password = await (0, common_1.hash)(newPassword);
        await this._userRepo.updateOne({ email }, { password });
        // await deleteFromCache(`${email}:otp`);
        await this._cacheProvider.delete(`${email}:otp`);
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
        if (loginDTO.FCM) {
            await this._cacheProvider.addToSet(`${userExist._id.toString()}:FCM`, loginDTO.FCM);
        }
        return (0, jwt_utils_1.generateTokens)(payloadData);
    }
    /**
     *
     * @param userId >> from accessToken
     * @param fcm >> FE
     */
    async logout(userId, fcm) {
        await this._cacheProvider.rmSet(`${userId.toString()}:FCM`, fcm);
    }
    async update(id, updateUserDTO) {
        return await this._userRepo.updateOne({ _id: id }, updateUserDTO);
    }
    async delete(id) {
        const userPosts = await this._postRepo.getAll({ userId: id }, { _id: 1 });
        const userPostIds = userPosts.map((post) => post._id);
        if (userPostIds.length > 0) {
            await this._commentRepo.deleteMany({ postId: { $in: userPostIds } });
        }
        await this._commentRepo.deleteMany({ userId: id });
        await this._postRepo.deleteMany({ userId: id });
        return await this._userRepo.deleteOne({ _id: id });
    }
}
exports.default = new AuthService(user_repository_1.userRepo, post_repository_1.postRepo, comment_repository_1.commentRepo, common_1.nodemailerProvider, init_1.redisCacheProvider);
