/**
 * Notification state manager for handling notification operations
 */

import { TNotification } from "./type";
import { SOCKET_CONFIG } from "./config";

export interface NotificationState {
  notifications: TNotification[];
  unreadCount: number;
}

export interface NotificationActions {
  addNotification: (notification: TNotification) => NotificationState;
  updateNotification: (notificationId: string, updates: Partial<TNotification>) => NotificationState;
  markAsRead: (notificationId: string) => NotificationState;
  markAllAsRead: () => NotificationState;
  setNotifications: (notifications: TNotification[]) => NotificationState;
  setUnreadCount: (count: number) => NotificationState;
  clearNotifications: () => NotificationState;
}

export class NotificationManager {
  private state: NotificationState;

  constructor(initialState: NotificationState = { notifications: [], unreadCount: 0 }) {
    this.state = initialState;
  }

  /**
   * Get current state
   */
  getState(): NotificationState {
    return { ...this.state };
  }

  /**
   * Add a new notification
   */
  addNotification(notification: TNotification): NotificationState {
    // Avoid duplicates
    const exists = this.state.notifications.some((n) => n.id === notification.id);
    if (exists) {
      return this.getState();
    }

    const newNotifications = [
      notification,
      ...this.state.notifications.slice(0, SOCKET_CONFIG.LIMITS.MAX_NOTIFICATIONS - 1)
    ];

    const newUnreadCount = notification.read 
      ? this.state.unreadCount 
      : this.state.unreadCount + 1;

    this.state = {
      notifications: newNotifications,
      unreadCount: newUnreadCount,
    };

    return this.getState();
  }

  /**
   * Update an existing notification
   */
  updateNotification(notificationId: string, updates: Partial<TNotification>): NotificationState {
    const updatedNotifications = this.state.notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, ...updates } : notif
    );

    // Recalculate unread count if read status changed
    let newUnreadCount = this.state.unreadCount;
    if (updates.read !== undefined) {
      const notification = this.state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read && updates.read) {
        newUnreadCount = Math.max(0, this.state.unreadCount - 1);
      } else if (notification && notification.read && !updates.read) {
        newUnreadCount = this.state.unreadCount + 1;
      }
    }

    this.state = {
      notifications: updatedNotifications,
      unreadCount: newUnreadCount,
    };

    return this.getState();
  }

  /**
   * Mark a specific notification as read
   */
  markAsRead(notificationId: string): NotificationState {
    return this.updateNotification(notificationId, { read: true });
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): NotificationState {
    const updatedNotifications = this.state.notifications.map((notif) => ({
      ...notif,
      read: true,
    }));

    this.state = {
      notifications: updatedNotifications,
      unreadCount: 0,
    };

    return this.getState();
  }

  /**
   * Set notifications (replace all)
   */
  setNotifications(notifications: TNotification[]): NotificationState {
    this.state = {
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
    };

    return this.getState();
  }

  /**
   * Set unread count directly
   */
  setUnreadCount(count: number): NotificationState {
    this.state = {
      ...this.state,
      unreadCount: Math.max(0, count),
    };

    return this.getState();
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): NotificationState {
    this.state = {
      notifications: [],
      unreadCount: 0,
    };

    return this.getState();
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: TNotification['type']): TNotification[] {
    return this.state.notifications.filter(n => n.type === type);
  }

  /**
   * Get notifications by priority
   */
  getNotificationsByPriority(priority: TNotification['priority']): TNotification[] {
    return this.state.notifications.filter(n => n.priority === priority);
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): TNotification[] {
    return this.state.notifications.filter(n => !n.read);
  }

  /**
   * Get notification by ID
   */
  getNotificationById(id: string): TNotification | undefined {
    return this.state.notifications.find(n => n.id === id);
  }
}