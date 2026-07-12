/**
 * Unified Socket Context Provider
 * Combines chat and notification functionality using the centralized socket center
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { socketCenter, SocketCenterConfig } from "./socketCenter";
import { TNotification } from "./type";
// import { TMessage } from "@/business/live-chat/types";
import { NotificationManager } from "./notificationManager";
import { notificationApi } from "./notificationApi";
import { TMessage } from "@/src/shared/chat/ui/types";

export interface UnifiedSocketContextType {
  // Connection status
  isConnected: boolean;
  
  // Chat functionality
  sendMessage: (message: TMessage) => void;
  emitTyping: (isTyping: boolean) => void;
  
  // Notification functionality
  notifications: TNotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
  addNotification: (notification: TNotification) => void;
  
  // Socket management
  reconnect: () => void;
  disconnect: () => void;
  updateUserId: (userId: string) => void;
}

export interface UnifiedSocketProviderProps {
  children: React.ReactNode;
  userId: string;
  autoConnect?: boolean;
  onMessage?: (message: TMessage) => void;
  onTyping?: (data: { userId: string; isTyping: boolean }) => void;
  onPresence?: (users: string[]) => void;
}

const UnifiedSocketContext = createContext<UnifiedSocketContextType | null>(null);

export const UnifiedSocketProvider: React.FC<UnifiedSocketProviderProps> = ({
  children,
  userId,
  autoConnect = true,
  onMessage,
  onTyping,
  onPresence,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
    console.error("Socket connection error:", error);
  }, []);

  const handleNotification = useCallback((notification: TNotification) => {
    notificationManagerRef.current.addNotification(notification);
    updateStateFromManager();
  }, [updateStateFromManager]);

  const handleUnreadCountUpdate = useCallback((count: number) => {
    notificationManagerRef.current.setUnreadCount(count);
    updateStateFromManager();
  }, [updateStateFromManager]);

  const handleNotificationUpdate = useCallback((
    notificationId: string, 
    updates: Partial<TNotification>
  ) => {
    notificationManagerRef.current.updateNotification(notificationId, updates);
    updateStateFromManager();
  }, [updateStateFromManager]);

  // Initialize socket center
  useEffect(() => {
    if (!userId) return;

    const config: SocketCenterConfig = {
      userId,
      autoConnect,
      chatHandlers: {
        onMessage,
        onTyping,
        onPresence,
      },
      notificationHandlers: {
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
        onConnectError: handleConnectError,
        onNotification: handleNotification,
        onUnreadCountUpdate: handleUnreadCountUpdate,
        onNotificationUpdate: handleNotificationUpdate,
      },
    };

    socketCenter.initialize(config);
    setIsConnected(socketCenter.getConnectionStatus());

    return () => {
      // Don't disconnect here as other components might be using the socket
      // The socket center manages its own lifecycle
    };
  }, [userId, autoConnect, onMessage, onTyping, onPresence, handleConnect, handleDisconnect, handleConnectError, handleNotification, handleUnreadCountUpdate, handleNotificationUpdate]);

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

        if (notificationsResult.success && notificationsResult.data?.notifications) {
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

  // Chat methods
  const sendMessage = useCallback((message: TMessage) => {
    socketCenter.sendMessage(message);
  }, []);

  const emitTyping = useCallback((isTyping: boolean) => {
    socketCenter.emitTyping(isTyping);
  }, []);

  // Notification methods
  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    if (!userId) return;

    try {
      const success = await notificationApi.markAsRead(notificationId, userId);
      if (success) {
        notificationManagerRef.current.markAsRead(notificationId);
        updateStateFromManager();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, [userId, updateStateFromManager]);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    if (!userId) return;

    try {
      const success = await notificationApi.markAllAsRead(userId);
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

  const addNotification = useCallback((notification: TNotification): void => {
    notificationManagerRef.current.addNotification(notification);
    updateStateFromManager();
  }, [updateStateFromManager]);

  // Socket management methods
  const reconnect = useCallback(() => {
    socketCenter.reconnect();
  }, []);

  const disconnect = useCallback(() => {
    socketCenter.disconnect();
    setIsConnected(false);
  }, []);

  const updateUserId = useCallback((newUserId: string) => {
    if (newUserId !== userId) {
      socketCenter.initialize({
        userId: newUserId,
        autoConnect: true,
        chatHandlers: {
          onMessage,
          onTyping,
          onPresence,
        },
        notificationHandlers: {
          onConnect: handleConnect,
          onDisconnect: handleDisconnect,
          onConnectError: handleConnectError,
          onNotification: handleNotification,
          onUnreadCountUpdate: handleUnreadCountUpdate,
          onNotificationUpdate: handleNotificationUpdate,
        },
      });
    }
  }, [userId, onMessage, onTyping, onPresence, handleConnect, handleDisconnect, handleConnectError, handleNotification, handleUnreadCountUpdate, handleNotificationUpdate]);

  const value: UnifiedSocketContextType = {
    isConnected,
    sendMessage,
    emitTyping,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
    reconnect,
    disconnect,
    updateUserId,
  };

  return (
    <UnifiedSocketContext.Provider value={value}>
      {children}
    </UnifiedSocketContext.Provider>
  );
};

/**
 * Hook to use the unified socket context
 */
export const useUnifiedSocket = (): UnifiedSocketContextType => {
  const context = useContext(UnifiedSocketContext);
  if (!context) {
    throw new Error("useUnifiedSocket must be used within a UnifiedSocketProvider");
  }
  return context;
};

/**
 * Hook for chat-specific functionality
 */
export const useUnifiedChat = () => {
  const { isConnected, sendMessage, emitTyping, reconnect, disconnect } = useUnifiedSocket();
  return {
    isConnected,
    sendMessage,
    emitTyping,
    reconnect,
    disconnect,
  };
};

/**
 * Hook for notification-specific functionality
 */
export const useUnifiedNotifications = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
  } = useUnifiedSocket();
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
  };
};
