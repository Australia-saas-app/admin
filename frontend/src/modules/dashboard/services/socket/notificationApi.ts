/**
 * Notification API service for handling HTTP requests
 */

import { TNotification } from "./type";
import { SOCKET_CONFIG, API_ENDPOINTS } from "./config";

export interface NotificationResponse {
  success: boolean;
  data?: {
    notifications?: TNotification[];
    count?: number;
  };
  error?: string;
}

export interface FetchNotificationsParams {
  type?: string;
  limit?: number;
  read?: boolean;
}

export class NotificationApiService {
  private baseUrl: string;

  constructor(baseUrl: string = SOCKET_CONFIG.URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch notifications with optional filters
   */
  async fetchNotifications(
    params: FetchNotificationsParams = {}
  ): Promise<NotificationResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.type) queryParams.append("type", params.type);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.read !== undefined) queryParams.append("read", params.read.toString());

      const url = `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS}?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Fetch unread notifications count
   */
  async fetchUnreadCount(type?: string): Promise<number> {
    try {
      const params: FetchNotificationsParams = { read: false };
      if (type) params.type = type;
      
      const result = await this.fetchNotifications(params);
      return result.data?.count || 0;
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      return 0;
    }
  }

  /**
   * Mark a specific notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}${API_ENDPOINTS.MARK_READ(notificationId)}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      return response.ok;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}${API_ENDPOINTS.MARK_ALL_READ(userId)}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationApi = new NotificationApiService();