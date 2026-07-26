import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  getUsersForAdmin,
  updateUserRole,
  updateUserStatus,
} from "./admin.service";
import { adminUserQuerySchema } from "./admin.validation";

export const findUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await getUsersForAdmin(adminUserQuerySchema.parse(req.query));

  res.status(200).json({ success: true, data: result });
});

export const changeUserRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUserRole(String(req.params.id), req.body.role);

  res.status(200).json({ success: true, data: { user } });
});

export const changeUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await updateUserStatus(String(req.params.id), req.body.isActive);

    res.status(200).json({ success: true, data: { user } });
  },
);
