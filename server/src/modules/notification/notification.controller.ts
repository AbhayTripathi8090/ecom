import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import type { NotificationQuery } from "./notification.types";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notification.service";

export const getNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getNotifications(req.query as unknown as NotificationQuery);

    res.status(200).json({ success: true, data: result });
  },
);

export const getUnreadCountController = asyncHandler(
  async (_req: Request, res: Response) => {
    const count = await getUnreadNotificationCount();

    res.status(200).json({ success: true, data: { count } });
  },
);

export const markNotificationAsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await markNotificationAsRead(String(req.params.id));

    if (!notification) {
      res.status(404).json({
        success: false,
        message: "Notification not found",
      });
      return;
    }

    res.status(200).json({ success: true, data: { notification } });
  },
);

export const markAllNotificationsAsReadController = asyncHandler(
  async (_req: Request, res: Response) => {
    await markAllNotificationsAsRead();

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  },
);