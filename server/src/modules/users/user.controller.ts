import type { Request, Response } from "express";
import { env } from "../../config/env";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  changeCurrentUserPassword,
  deleteCurrentUser,
  getCurrentUser,
  getUserForAdmin,
  updateCurrentUser,
} from "./user.service";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.id);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateCurrentUser(req.user!.id, req.body, req.file);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    await changeCurrentUserPassword(req.user!.id, req.body);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  },
);

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  await deleteCurrentUser(req.user!.id);

  res.clearCookie("accessToken", cookieOptions).status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

export const getUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getUserForAdmin(String(req.params.id));

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  },
);
