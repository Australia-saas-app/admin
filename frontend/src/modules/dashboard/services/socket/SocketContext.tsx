/**
 * Socket Context Provider - Refactored with separation of concerns
 */

import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  SocketContextType,
  SocketProviderProps,
  TNotification
} from "./type";
import { socketService } from "./socketService";
import { notificationApi } from "./notificationApi";
import { NotificationManager } from "./notificationManager";

// Create context
export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

// Provider component
export const SocketContextProvider: React.FC<SocketProviderProps> = ({
  children,
  userId = "admin", // Default to admin, but allow override
}) => {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const notificationManagerRef = useRef(new NotificationManager());

  // Update state from notification manager
  const updateStateFromManager = useCallback(() => {
    const state = notificationManagerRef.current.getState();
    setNotifications(state.notifications);
    setUnreadCount(state.unreadCount);
  }, []);

  // Socket event handlers
  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const handleConnectError = useCallback((error: Error) => {
    setIsConnected(false);
  }, []);

  const handleNotification = useCallback(
    (notification: TNotification) => {
      notificationManagerRef.current.addNotification(notification);
      updateStateFromManager();
    },
    [updateStateFromManager]
  );

  const handleUnreadCountUpdate = useCallback(
    (count: number) => {
      notificationManagerRef.current.setUnreadCount(count);
      updateStateFromManager();
    },
    [updateStateFromManager]
  );

  const handleNotificationUpdate = useCallback(
    (notificationId: string, updates: Partial<TNotification>) => {
      notificationManagerRef.current.updateNotification(
        notificationId,
        updates
      );
      updateStateFromManager();
    },
    [updateStateFromManager]
  );

  // Socket connection effect
  useEffect(() => {
    if (!userId) return;

    const handlers = {
      onConnect: handleConnect,
      onDisconnect: handleDisconnect,
      onConnectError: handleConnectError,
      onNotification: handleNotification,
      onUnreadCountUpdate: handleUnreadCountUpdate,
      onNotificationUpdate: handleNotificationUpdate,
    };

    socketService.connect(userId, handlers);

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [
    userId,
    handleConnect,
    handleDisconnect,
    handleConnectError,
    handleNotification,
    handleUnreadCountUpdate,
    handleNotificationUpdate,
  ]);

  // Fetch initial notifications
  useEffect(() => {
    if (!userId) return;

    const fetchInitialData = async () => {
      try {
        // Fetch notifications
        const notificationsResult = await notificationApi.fetchNotifications({
          type: "order",
          limit: 50,
          read: false,
        });

        if (
          notificationsResult.success &&
          notificationsResult.data?.notifications
        ) {
          notificationManagerRef.current.setNotifications(
            notificationsResult.data.notifications
          );
          updateStateFromManager();
        }

        // Fetch unread count
        const unreadCount = await notificationApi.fetchUnreadCount("order");
        if (unreadCount > 0) {
          notificationManagerRef.current.setUnreadCount(unreadCount);
          updateStateFromManager();
        }
      } catch (error) {
        console.error("Failed to fetch initial notification data:", error);
      }
    };

    fetchInitialData();
  }, [userId, updateStateFromManager]);

  // API methods using the new services
  const markAsRead = useCallback(
    async (notificationId: string): Promise<void> => {
      if (!userId) return;

      try {
        const success = await notificationApi.markAsRead(
          notificationId,
          userId
        );
        if (success) {
          notificationManagerRef.current.markAsRead(notificationId);
          updateStateFromManager();
        }
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [userId, updateStateFromManager]
  );

  const markAllAsRead = useCallback(async (): Promise<void> => {
    if (!userId) return;

    try {
      const success = await notificationApi.markAllAsRead(userId);
      console.log("🚀 ~ markAllAsRead ~ success:", success);
      if (success) {
        notificationManagerRef.current.markAllAsRead();
        updateStateFromManager();
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, [userId, updateStateFromManager]);

  const clearNotifications = useCallback((): void => {
    notificationManagerRef.current.clearNotifications();
    updateStateFromManager();
  }, [updateStateFromManager]);

  const addNotification = useCallback(
    (notification: TNotification): void => {
      notificationManagerRef.current.addNotification(notification);
      updateStateFromManager();
    },
    [updateStateFromManager]
  );

  const value: SocketContextType = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
