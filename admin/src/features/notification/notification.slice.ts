import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNotificationsThunk,
  markAllNotificationsReadThunk,
  markNotificationReadThunk,
} from "./notification.thunk";
import type { AdminNotification, NotificationState } from "./notification.types";

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    receiveNotification: (state, action: PayloadAction<AdminNotification>) => {
      const notification = action.payload;
      const existingIndex = state.notifications.findIndex(
        (item) => item.id === notification.id,
      );

      if (existingIndex >= 0) {
        state.notifications[existingIndex] = notification;
        return;
      }

      state.notifications.unshift(notification);
      state.notifications = state.notifications.slice(0, 10);

      if (!notification.isRead) {
        state.unreadCount += 1;
      }
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load notifications";
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index >= 0 && !state.notifications[index].isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        if (index >= 0) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(markNotificationReadThunk.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to mark notification as read";
      })
      .addCase(markAllNotificationsReadThunk.fulfilled, (state) => {
        state.unreadCount = 0;
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));
      })
      .addCase(markAllNotificationsReadThunk.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to mark notifications as read";
      });
  },
});

export const { receiveNotification, clearNotificationError } =
  notificationSlice.actions;
export default notificationSlice.reducer;
