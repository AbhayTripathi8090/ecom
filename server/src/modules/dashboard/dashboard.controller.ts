import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getAdminDashboard } from "./dashboard.service";

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const dashboard = await getAdminDashboard();

  res.status(200).json({ success: true, data: { dashboard } });
});
