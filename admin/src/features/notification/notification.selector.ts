import type { RootState } from "../../store";

export const selectNotifications = (state: RootState) =>
  state.notification.notifications;
export const selectUnreadNotificationCount = (state: RootState) =>
  state.notification.unreadCount;
export const selectNotificationsLoading = (state: RootState) =>
  state.notification.isLoading;
export const selectNotificationError = (state: RootState) =>
  state.notification.error;
