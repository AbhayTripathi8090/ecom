import type { Types } from "mongoose";
import type { NotificationType } from "./notification.model";

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  entityId?: Types.ObjectId | string | null;
}

export interface NotificationQuery {
  page: number;
  limit: number;
  isRead?: boolean;
}