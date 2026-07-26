import type { Request, Response } from "express";
import { env } from "../../config/env";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  changeUserPassword,
  loginUser,
  registerUser,
  updateUserProfileImage,
} from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: env.JWT_COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
};

const sendAuthResponse = (
  res: Response,
  statusCode: number,
  data: Awaited<ReturnType<typeof registerUser>>,
): void => {
  res
    .cookie("accessToken", data.tokens.accessToken, cookieOptions)
    .status(statusCode)
    .json({
      success: true,
      data,
    });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await registerUser(req.body, req.file);
  sendAuthResponse(res, 201, data);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await loginUser(req.body);
  sendAuthResponse(res, 200, data);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken", cookieOptions).status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    await changeUserPassword(req.user!.id, req.body);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  },
);

export const updateProfileImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
      return;
    }

    const user = await updateUserProfileImage(req.user!.id, req.file);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  },
);
