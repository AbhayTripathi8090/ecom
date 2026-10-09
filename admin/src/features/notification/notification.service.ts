import { io, type Socket } from "socket.io-client";
import { api } from "../../lib/api";
import { normalizeMongo } from "../../lib/normalize";
import { API_BASE_URL } from "../../utils/constants";
import { NOTIFICATION_ENDPOINTS } from "./notification.endpoints";
import type { AdminNotification } from "./notification.types";

interface NotificationSocketEvents {
  "admin:notification": (
    notification: Omit<AdminNotification, "id"> & { _id: string },
  ) => void;
}

const socketUrl = new URL(API_BASE_URL).origin;

export const notificationService = {
  getRecent: async (): Promise<AdminNotification[]> => {
    const response = await api.get<{
      notifications: AdminNotification[];
    }>(NOTIFICATION_ENDPOINTS.LIST, { page: 1, limit: 10 });

    return normalizeMongo(response.data.notifications);
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>(
      NOTIFICATION_ENDPOINTS.UNREAD_COUNT,
    );

    return response.data.count;
  },

  markAsRead: async (id: string): Promise<AdminNotification> => {
    const response = await api.patch<{ notification: AdminNotification }>(
      NOTIFICATION_ENDPOINTS.MARK_READ(id),
    );

    return normalizeMongo(response.data.notification);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
  },

  connect: (token: string): Socket<NotificationSocketEvents> => {
    return io(socketUrl, {
      auth: { token },
      withCredentials: true,
    }) as Socket<NotificationSocketEvents>;
  },
};
