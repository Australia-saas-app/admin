/**
 * Centralized Socket Management Center
 * Manages all socket connections and provides unified interface for different features
 */

import { io, Socket } from "socket.io-client";
import { TNotification } from "./type";
import { SOCKET_CONFIG, SOCKET_EVENTS } from "./config";
import { TMessage } from "../../live-chat/types";
// import { TMessage } from "@/modules/live-chat/types";

export interface ChatEventHandlers {
  onMessage?: (message: TMessage) => void;
  onTyping?: (data: { userId: string; isTyping: boolean }) => void;
  onPresence?: (users: string[]) => void;
}

export interface NotificationEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onConnectError?: (error: Error) => void;
  onNotification?: (notification: TNotification) => void;
  onUnreadCountUpdate?: (count: number) => void;
  onNotificationUpdate?: (
    notificationId: string,
    updates: Partial<TNotification>
  ) => void;
}

export interface SocketCenterConfig {
  userId: string;
  chatHandlers?: ChatEventHandlers;
  notificationHandlers?: NotificationEventHandlers;
  autoConnect?: boolean;
}

export class SocketCenter {
  private static instance: SocketCenter | null = null;
  private socket: Socket | null = null;
  private userId: string | null = null;
  private chatHandlers: ChatEventHandlers = {};
  private notificationHandlers: NotificationEventHandlers = {};
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): SocketCenter {
    if (!SocketCenter.instance) {
      SocketCenter.instance = new SocketCenter();
    }
    return SocketCenter.instance;
  }

  /**
   * Initialize socket connection with configuration
   */
  initialize(config: SocketCenterConfig): void {
    if (this.socket?.connected && this.userId === config.userId) {
      // Already connected with same user, just update handlers
      this.updateHandlers(config.chatHandlers, config.notificationHandlers);
      return;
    }

    this.disconnect();

    this.userId = config.userId;
    this.chatHandlers = config.chatHandlers || {};
    this.notificationHandlers = config.notificationHandlers || {};

    if (config.autoConnect !== false) {
      this.connect();
    }
  }

  /**
   * Connect to socket server
   */
  connect(): void {
    if (!this.userId) {
      console.error("❌ Cannot connect: userId is required");
      return;
    }

    this.socket = io(SOCKET_CONFIG.URL, {
      ...SOCKET_CONFIG.OPTIONS,
      transports: ["websocket"] as string[],
    });
    this.setupEventListeners();
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  /**
   * Update event handlers without reconnecting
   */
  updateHandlers(
    chatHandlers?: ChatEventHandlers,
    notificationHandlers?: NotificationEventHandlers
  ): void {
    if (chatHandlers) {
      this.chatHandlers = { ...this.chatHandlers, ...chatHandlers };
    }
    if (notificationHandlers) {
      this.notificationHandlers = {
        ...this.notificationHandlers,
        ...notificationHandlers,
      };
    }
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket || !this.userId) return;

    const socket = this.socket;
    const userId = this.userId;

    // Connection events
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      socket.emit(SOCKET_EVENTS.REGISTER, userId);
      console.log(`✅ Socket connected as ${userId}`);
      this.notificationHandlers.onConnect?.();
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      this.isConnected = false;
      console.log(`❌ Socket disconnected for ${userId}`);
      this.notificationHandlers.onDisconnect?.();
    });

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error: Error) => {
      this.isConnected = false;
      this.reconnectAttempts++;
      console.error(`❌ Socket connection error for ${userId}:`, error);
      this.notificationHandlers.onConnectError?.(error);

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error(`❌ Max reconnection attempts reached for ${userId}`);
      }
    });

    // Chat events
    socket.on("private_message", (message: TMessage) => {
      this.chatHandlers.onMessage?.(message);
    });

    socket.on("typing", (data: { userId: string; isTyping: boolean }) => {
      this.chatHandlers.onTyping?.(data);
    });

    socket.on("presence", (users: string[]) => {
      this.chatHandlers.onPresence?.(users);
    });

    // Notification events
    socket.on(
      SOCKET_EVENTS.NOTIFICATION(userId),
      (notification: TNotification) => {
        this.notificationHandlers.onNotification?.(notification);
      }
    );

    socket.on(
      SOCKET_EVENTS.UNREAD_COUNT(userId),
      ({ count }: { count: number }) => {
        this.notificationHandlers.onUnreadCountUpdate?.(count);
      }
    );

    socket.on(
      SOCKET_EVENTS.NOTIFICATION_UPDATE(userId),
      ({
        notificationId,
        updates,
      }: {
        notificationId: string;
        updates: Partial<TNotification>;
      }) => {
        this.notificationHandlers.onNotificationUpdate?.(
          notificationId,
          updates
        );
      }
    );

    // Admin-specific notification events (for admin users)
    // Check if this is an admin user and listen for admin room events
    if (userId === 'admin' || userId.includes('admin') || userId.startsWith('admin_')) {
      socket.on(
        SOCKET_EVENTS.ADMIN_NOTIFICATION,
        (notification: TNotification) => {
          this.notificationHandlers.onNotification?.(notification);
        }
      );

      socket.on(
        SOCKET_EVENTS.ADMIN_UNREAD_COUNT,
        ({ count }: { count: number }) => {
          this.notificationHandlers.onUnreadCountUpdate?.(count);
        }
      );
    }
  }

  /**
   * Send a private message
   */
  sendMessage(message: TMessage): void {
    if (this.socket?.connected) {
      this.socket.emit("private_message", message);
    } else {
      console.error("❌ Cannot send message: Socket not connected");
    }
  }

  /**
   * Emit typing status
   */
  emitTyping(isTyping: boolean): void {
    if (this.socket?.connected && this.userId) {
      this.socket.emit("typing", { userId: this.userId, isTyping });
    }
  }

  /**
   * Register user with server
   */
  register(): void {
    if (this.userId && this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.REGISTER, this.userId);
    }
  }

  /**
   * Emit custom event
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.error(`❌ Cannot emit ${event}: Socket not connected`);
    }
  }

  /**
   * Listen to custom event
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return (this.isConnected && this.socket?.connected) || false;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.userId;
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Force reconnection
   */
  reconnect(): void {
    if (this.userId) {
      this.disconnect();
      setTimeout(() => this.connect(), 1000);
    }
  }

  /**
   * Clean up and reset
   */
  cleanup(): void {
    this.disconnect();
    this.userId = null;
    this.chatHandlers = {};
    this.notificationHandlers = {};
    SocketCenter.instance = null;
  }
}

// Export singleton instance
export const socketCenter = SocketCenter.getInstance();
