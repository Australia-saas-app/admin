/**
 * Custom hooks for notification management
 */

import { useContext } from "react";
import { SocketContext } from "./SocketContext";
import { SocketContextType, TNotification } from "./type";

/**
 * Hook to access the socket context
 * @throws Error if used outside of SocketContextProvider
 */
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocket must be used within a SocketContextProvider"
    );
  }
  return context;
};

/**
 * Hook to access notification functionality
 * @throws Error if used outside of SocketContextProvider
 */
export const useNotifications = (): SocketContextType => {
  return useSocket();
};

/**
 * Hook for order-specific notifications
 * Filters notifications to only show order-related ones
 */
export const useOrderNotifications = () => {
  const { notifications, ...rest } = useNotifications();

  const orderNotifications = notifications.filter(
    (notification: TNotification) => notification.type === "order"
  );

  return {
    notifications: orderNotifications,
    ...rest,
  };
};

/**
 * Hook for message-specific notifications
 * Filters notifications to only show message-related ones
 */
export const useMessageNotifications = () => {
  const { notifications, ...rest } = useNotifications();

  const messageNotifications = notifications.filter(
    (notification: TNotification) => notification.type === "message"
  );

  return {
    notifications: messageNotifications,
    ...rest,
  };
};

/**
 * Hook for system notifications
 * Filters notifications to only show system-related ones
 */
export const useSystemNotifications = () => {
  const { notifications, ...rest } = useNotifications();

  const systemNotifications = notifications.filter(
    (notification: TNotification) => notification.type === "system"
  );

  return {
    notifications: systemNotifications,
    ...rest,
  };
};

/**
 * Hook for high priority notifications
 * Filters notifications to only show high priority ones
 */
export const useHighPriorityNotifications = () => {
  const { notifications, ...rest } = useNotifications();

  const highPriorityNotifications = notifications.filter(
    (notification: TNotification) => notification.priority === "high"
  );

  return {
    notifications: highPriorityNotifications,
    ...rest,
  };
};

/**
 * Hook for unread notifications only
 * Filters notifications to only show unread ones
 */
export const useUnreadNotifications = () => {
  const { notifications, ...rest } = useNotifications();

  const unreadNotifications = notifications.filter(
    (notification: TNotification) => !notification.read
  );

  return {
    notifications: unreadNotifications,
    ...rest,
  };
};

/**
 * Hook for connection status
 * Returns only the connection status and related functionality
 */
export const useSocketConnection = () => {
  const { isConnected } = useSocket();
  
  return {
    isConnected,
  };
};