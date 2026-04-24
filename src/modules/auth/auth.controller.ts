import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import authService from "./auth.service";
import { isvalid } from "../../middleware";
import { loginSchema, signupSchema } from "./auth.validation";

const router = Router();

router.post(
  "/signup",
  isvalid(signupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.signup(req.body);
    return res.status(201).json({
      message: "user created successfully",
      success: true,
    });
  },
);

router.post(
  "/verify-account",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.verifyAccount(req.body);
    return res.status(200).json({
      message: "user verified successfully",
      success: true,
    });
  },
);

router.post(
  "/send-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.sendOTP(req.body);
    return res.status(200).json({
      message: "OTP sent successfully",
      success: true,
    });
  },
);

router.patch(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.resetPassword(req.body);
    return res.status(200).json({
      message: "password updated successfully",
      success: true,
    });
  },
);

router.post(
  "/login",
  isvalid(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const tokens = await authService.login(req.body);
    return res.status(200).json({
      message: "user loggedin successfully",
      success: true,
      data: tokens,
    });
  },
);

export default router;
