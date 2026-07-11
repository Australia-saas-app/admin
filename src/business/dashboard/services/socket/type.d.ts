import { ReactNode } from "react";

// Notification types
export type NotificationType = "order" | "message" | "system";
export type NotificationPriority = "low" | "medium" | "high";

export interface TNotification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  orderId?: string;
  userId: string;
  priority: NotificationPriority;
  createdAt: string;
  read: boolean;
  data?: Record<string, any>;
}

// Context types
export interface SocketContextType {
  notifications: TNotification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
  addNotification: (notification: TNotification) => void;
}

export interface SocketProviderProps {
  children: ReactNode;
  userId?: string;
}

// Error types
export interface SocketError {
  message: string;
  code?: string;
  timestamp: Date;
}

// Event payload types
export interface UnreadCountPayload {
  count: number;
}

export interface NotificationUpdatePayload {
  notificationId: string;
  updates: Partial<TNotification>;
}

export type TConversation = {
  _id?: string;
  type: MessageType;
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  serviceType: string;
  conversationId: string;
  createdAt?: Date;
  updatedAt?: Date;
  orderId?: string;
  authority?: string;
};

type IFile = {
  image?: string;
  video?: string;
  audio?: string;
  document?: string;
};

type MessageType = "live" | "order";
type Authority = "user" | "sub_admin" | "admin";

export type TMessage = {
  _id?: string;
  type: MessageType;
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  content: string;
  conversationId: string;
  authority?: Authority;
  serviceType: string;
  file?: IFile;
  createdAt?: Date;
  updatedAt?: Date;
  orderId?: string;
};
