"use client";

import { Bell, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useChatContext } from "../hooks/useChatContext";

interface Notification {
  notificationId: string;
  type: string;
  title: string;
  description: string;
  conversationId: string | null;
  senderId: string;
  senderName: string;
  read: boolean;
  createdAt: Date;
}

export const NotificationCenter = () => {
  const { fetchNotifications, getUnreadCount } = useChatContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    loadNotifications();
    // Poll for new notifications every 5 seconds
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications, getUnreadCount]);

  const handleNotificationClick = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.notificationId === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_message":
        return "💬";
      case "user_online":
        return "🟢";
      case "missed_call":
        return "📞";
      default:
        return "🔔";
    }
  };

  // Unused function - keeping for future use
  // const getNotificationColor = (type: string) => {
  //   switch (type) {
  //     case "new_message":
  //       return "border-l-4 border-l-blue-500";
  //     case "user_online":
  //       return "border-l-4 border-l-green-500";
  //     case "missed_call":
  //       return "border-l-4 border-l-red-500";
  //     default:
  //       return "border-l-4 border-l-gray-500";
  //   }
  // };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 hover:bg-yellow-50 rounded-lg transition-all duration-200 group"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-yellow-600 group-hover:text-yellow-700 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-14 w-80 max-h-[500px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-linear-to-r from-yellow-50 to-amber-50">
            <div>
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Bell className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.notificationId}
                    onClick={() => handleNotificationClick(notif.notificationId)}
                    className={`p-3.5 hover:bg-yellow-50 cursor-pointer transition-colors group ${
                      !notif.read ? "bg-yellow-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 flex items-center justify-center rounded-lg shrink-0 text-lg ${
                        notif.type === "new_message" ? "bg-blue-100" :
                        notif.type === "user_online" ? "bg-green-100" :
                        notif.type === "missed_call" ? "bg-red-100" :
                        "bg-gray-100"
                      }`}>
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full shrink-0 mt-1.5"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                          {notif.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {new Date(notif.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 p-3 bg-gray-50 flex gap-2">
              <button className="flex-1 text-sm text-yellow-600 hover:text-yellow-700 font-semibold py-2 hover:bg-yellow-50 rounded-lg transition-colors">
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
