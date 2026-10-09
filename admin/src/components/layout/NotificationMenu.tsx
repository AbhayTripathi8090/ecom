import React, { useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  markAllNotificationsReadThunk,
  markNotificationReadThunk,
  selectNotificationError,
  selectNotifications,
  selectNotificationsLoading,
  selectUnreadNotificationCount,
} from "../../features/notification";

const formatTime = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
};

export const NotificationMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadNotificationCount);
  const isLoading = useAppSelector(selectNotificationsLoading);
  const error = useAppSelector(selectNotificationError);
  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = async (id: string) => {
    const result = await dispatch(markNotificationReadThunk(id));
    if (markNotificationReadThunk.rejected.match(result)) {
      toast.error(result.payload ?? "Could not mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    const result = await dispatch(markAllNotificationsReadThunk());
    if (markAllNotificationsReadThunk.rejected.match(result)) {
      toast.error(result.payload ?? "Could not mark notifications as read");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="relative rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <section
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-3 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40"
        >
          <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Notifications</h2>
              <p className="text-xs text-slate-400">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </header>

          {error && (
            <p role="alert" className="border-b border-rose-900/50 px-4 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}

          <div className="max-h-[min(28rem,70vh)] overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">
                Loading notifications…
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">
                You’re all caught up.
              </p>
            ) : (
              notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`flex gap-3 border-b border-slate-800/80 px-4 py-3 last:border-b-0 ${
                    notification.isRead ? "bg-slate-900" : "bg-indigo-950/30"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      notification.isRead ? "bg-slate-600" : "bg-indigo-400"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-slate-100">
                      {notification.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-400">
                      {notification.message}
                    </p>
                    <time
                      dateTime={notification.createdAt}
                      className="mt-1 block text-[10px] text-slate-500"
                    >
                      {formatTime(notification.createdAt)}
                    </time>
                  </div>
                  {!notification.isRead && (
                    <button
                      type="button"
                      aria-label={`Mark ${notification.title} as read`}
                      title="Mark as read"
                      onClick={() => markAsRead(notification.id)}
                      className="h-fit rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};
