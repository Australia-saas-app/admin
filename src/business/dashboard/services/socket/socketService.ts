/**
 * Socket service for managing WebSocket connections and events
 */

import { io, Socket } from "socket.io-client";
import { TNotification } from "./type";
import { SOCKET_CONFIG, SOCKET_EVENTS } from "./config";

export interface SocketEventHandlers {
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

export class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private handlers: SocketEventHandlers = {};

  /**
   * Initialize socket connection
   */
  connect(userId: string, handlers: SocketEventHandlers): void {
    if (this.socket?.connected) {
      this.disconnect();
    }

    this.userId = userId;
    this.handlers = handlers;

    this.socket = io(SOCKET_CONFIG.URL, {
      ...SOCKET_CONFIG.OPTIONS,
      transports: ["websocket"], // Convert readonly array to mutable array
    });
    this.setupEventListeners();
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.userId = null;
    this.handlers = {};
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
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
      socket.emit(SOCKET_EVENTS.REGISTER, userId);
      console.log(`✅ Connected to notification service as ${userId}`);
      this.handlers.onConnect?.();
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`❌ Disconnected from notification service as ${userId}`);
      this.handlers.onDisconnect?.();
    });

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error: Error) => {
      console.error(`❌ Socket connection error as ${userId}:`, error);
      this.handlers.onConnectError?.(error);
    });

    // Notification events
    socket.on(
      SOCKET_EVENTS.NOTIFICATION(userId),
      (notification: TNotification) => {
        this.handlers.onNotification?.(notification);
      }
    );

    socket.on(
      SOCKET_EVENTS.UNREAD_COUNT(userId),
      ({ count }: { count: number }) => {
        this.handlers.onUnreadCountUpdate?.(count);
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
        this.handlers.onNotificationUpdate?.(notificationId, updates);
      }
    );
  }

  /**
   * Emit an event to the server
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Register user with the server
   */
  register(): void {
    if (this.userId && this.socket?.connected) {
      this.emit(SOCKET_EVENTS.REGISTER, this.userId);
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
