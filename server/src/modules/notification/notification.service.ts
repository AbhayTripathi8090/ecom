import mongoose from "mongoose";
import Notification from "./notification.model";
import type {
  CreateNotificationInput,
  NotificationQuery,
} from "./notification.types";
import { getIO } from "../../config/socket";
import { AppError } from "../../utils/AppError";
import { getPagination } from "../../utils/pagination";

export const createAdminNotification = async (
  data: CreateNotificationInput
) => {
  // Save the notification first.
  const notification = await Notification.create({
    type: data.type,
    title: data.title,
    message: data.message,
    entityId: data.entityId ?? null,
  });

  // Then deliver it to connected admins.
  getIO().to("admins").emit("admin:notification", {
    _id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    entityId: notification.entityId?.toString() ?? null,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  });

  return notification;
};

export const getNotifications = async (
  query: NotificationQuery
) => {
  const { page, limit, isRead } = query;

  const filter: Record<string, unknown> = {};

  if (isRead !== undefined) {
    filter.isRead = isRead;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    meta: getPagination(page, limit, total),
  };
};

export const getUnreadNotificationCount = async () => {
  return Notification.countDocuments({ isRead: false });
};

export const markNotificationAsRead = async (
  id: string
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid notification ID", 400);
  }

  return Notification.findByIdAndUpdate(
    id,
    { $set: { isRead: true } },
    { new: true, runValidators: true }
  );
};

export const markAllNotificationsAsRead = async () => {
  return Notification.updateMany(
    { isRead: false },
    { $set: { isRead: true } }
  );
};