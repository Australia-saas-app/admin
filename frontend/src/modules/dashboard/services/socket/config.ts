/**
 * Socket configuration constants and settings
 */

export const SOCKET_CONFIG = {
  URL: process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8000",
  OPTIONS: {
    transports: ["websocket"] as const,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  },
  LIMITS: {
    MAX_NOTIFICATIONS: 1000,
    DISPLAY_LIMIT: 50,
  },
} as const;

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  REGISTER: "register",
  NOTIFICATION: (userId: string) => `notification:${userId}`,
  UNREAD_COUNT: (userId: string) => `unread-count:${userId}`,
  NOTIFICATION_UPDATE: (userId: string) => `notification-update:${userId}`,
  // Admin-specific events
  ADMIN_NOTIFICATION: "notification",
  ADMIN_UNREAD_COUNT: "unread-count:admin",
} as const;

export const API_ENDPOINTS = {
  NOTIFICATIONS: "/api/notifications",
  MARK_READ: (notificationId: string) => `/api/notifications/${notificationId}/read`,
  MARK_ALL_READ: (userId: string) => `/api/notifications/${userId}/read-all`,
} as const;