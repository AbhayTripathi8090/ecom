import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/helpers";
import { notificationService } from "./notification.service";
import type { AdminNotification } from "./notification.types";

export const fetchNotificationsThunk = createAsyncThunk<
  { notifications: AdminNotification[]; unreadCount: number },
  void,
  { rejectValue: string }
>("notification/fetch", async (_, { rejectWithValue }) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      notificationService.getRecent(),
      notificationService.getUnreadCount(),
    ]);

    return { notifications, unreadCount };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const markNotificationReadThunk = createAsyncThunk<
  AdminNotification,
  string,
  { rejectValue: string }
>("notification/markRead", async (id, { rejectWithValue }) => {
  try {
    return await notificationService.markAsRead(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const markAllNotificationsReadThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notification/markAllRead", async (_, { rejectWithValue }) => {
  try {
    await notificationService.markAllAsRead();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
