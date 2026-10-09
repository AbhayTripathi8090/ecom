export type NotificationType =
  | "USER_REGISTERED"
  | "ORDER_PLACED"
  | "ORDER_CANCELLED";

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityId: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationState {
  notifications: AdminNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}
