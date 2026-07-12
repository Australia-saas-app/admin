/**
 * Live Chat Service
 * Handles all chat-related operations with demo data
 * TODO: Replace demo data with actual API calls
 */

import {
  demoCallLogs,
  demoConversations,
  demoDeliveryStatuses,
  demoGroupConversations,
  demoMessages,
  demoNotifications,
  demoUsers,
  filterMessagesByAuthority,
  filterMessagesByService,
  searchMessages,
} from "../data/demoData";
import type { DeliveryStatus, TConversation, TMessage, UserPresence } from "../types";

/**
 * Message Management
 */
export const messageService = {
  // Fetch all messages for a conversation
  async fetchMessages(conversationId: string): Promise<TMessage[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 0));
    return demoMessages.filter((msg) => msg.conversationId === conversationId);
  },

  // Fetch message history with pagination
  async fetchMessageHistory(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ messages: TMessage[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const messages = demoMessages.filter((msg) => msg.conversationId === conversationId);
    const start = (page - 1) * limit;
    return {
      messages: messages.slice(start, start + limit),
      total: messages.length,
    };
  },

  // Send a message
  async sendMessage(message: TMessage): Promise<TMessage> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const newMessage: TMessage = {
      ...message,
      _id: `msg-${Date.now()}`,
      deliveryStatus: "sent",
      createdAt: new Date(),
    };
    // In real app, push to demoMessages or API
    return newMessage;
  },

  // Search messages
  async searchMessages(query: string): Promise<TMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return searchMessages(query, demoMessages);
  },

  // Filter messages by service type
  async filterByService(serviceType: string): Promise<TMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return filterMessagesByService(serviceType, demoMessages);
  },

  // Filter messages by authority level
  async filterByAuthority(authority: string): Promise<TMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return filterMessagesByAuthority(authority, demoMessages);
  },
};

/**
 * Conversation Management
 */
export const conversationService = {
  // Fetch all conversations
  async fetchConversations(): Promise<TConversation[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return demoConversations;
  },

  // Create a new conversation
  async createConversation(conversation: Partial<TConversation>): Promise<TConversation> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const newConversation: TConversation = {
      _id: `conv-${Date.now()}`,
      conversationId: `conv-${Date.now()}`,
      type: "live",
      senderId: conversation.senderId || "",
      senderName: conversation.senderName || "",
      receiverId: conversation.receiverId,
      receiverName: conversation.receiverName,
      serviceType: conversation.serviceType || "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newConversation;
  },

  // Get conversation details
  async getConversationDetails(conversationId: string): Promise<TConversation | null> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return demoConversations.find((conv) => conv.conversationId === conversationId) || null;
  },

  // Update conversation
  async updateConversation(
    conversationId: string,
    updates: Partial<TConversation>
  ): Promise<TConversation> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const conversation = demoConversations.find((c) => c.conversationId === conversationId);
    if (!conversation) throw new Error("Conversation not found");
    return { ...conversation, ...updates, updatedAt: new Date() };
  },
};

/**
 * User Presence & Status Management
 */
export const presenceService = {
  // Get all online users
  async getOnlineUsers(): Promise<UserPresence[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return demoUsers
      .filter((u) => u.status === "online")
      .map((u) => ({
        userId: u.id,
        status: "online" as const,
        lastSeen: u.lastSeen,
        isTyping: false,
      }));
  },

  // Get user presence status
  async getUserPresence(userId: string): Promise<UserPresence | null> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const user = demoUsers.find((u) => u.id === userId);
    if (!user) return null;
    return {
      userId: user.id,
      status: user.status as "online" | "offline",
      lastSeen: user.lastSeen,
      isTyping: false,
    };
  },

  // Update user presence
  async updateUserPresence(userId: string, status: "online" | "offline" | "away"): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const user = demoUsers.find((u) => u.id === userId);
    if (user) {
      user.status = status;
      user.lastSeen = status === "offline" ? new Date() : user.lastSeen;
    }
  },

  // Set typing indicator
  async setTypingIndicator(_conversationId: string, _userId: string, _isTyping: boolean): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    // In real app, emit via WebSocket
  },
};

/**
 * Delivery Status Management
 */
export const deliveryService = {
  // Get message delivery status
  async getDeliveryStatus(messageId: string): Promise<DeliveryStatus | null> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return (demoDeliveryStatuses[messageId as keyof typeof demoDeliveryStatuses] as DeliveryStatus) || null;
  },

  // Update delivery status
  async updateDeliveryStatus(
    messageId: string,
    status: DeliveryStatus,
    _timestamp?: Date
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (demoDeliveryStatuses[messageId as keyof typeof demoDeliveryStatuses]) {
      demoDeliveryStatuses[messageId as keyof typeof demoDeliveryStatuses] = status;
    }
  },

  // Mark message as read
  async markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    messageIds.forEach((id) => {
      demoDeliveryStatuses[id as keyof typeof demoDeliveryStatuses] = "read";
    });
  },
};

/**
 * Group Conversation Management (Admin Feature)
 */
export const groupConversationService = {
  // Fetch all group conversations
  async fetchGroupConversations(): Promise<TConversation[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return demoGroupConversations;
  },

  // Create a group conversation
  async createGroupConversation(data: {
    groupName: string;
    participants: string[];
  }): Promise<TConversation> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const newGroup: TConversation = {
      _id: `group-${Date.now()}`,
      conversationId: `group-${Date.now()}`,
      type: "live",
      senderId: "admin-001",
      senderName: "Admin User",
      serviceType: "Group",
      groupName: data.groupName,
      participants: data.participants,
      createdBy: "admin-001",
      isGroup: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as TConversation;
    return newGroup;
  },

  // Add participant to group
  async addParticipantToGroup(
    conversationId: string,
    userId: string
  ): Promise<TConversation> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const group = demoGroupConversations.find((g) => g.conversationId === conversationId);
    if (!group) throw new Error("Group not found");
    if (!group.participants) group.participants = [];
    if (!group.participants.includes(userId)) {
      group.participants.push(userId);
    }
    return group;
  },

  // Remove participant from group
  async removeParticipantFromGroup(
    conversationId: string,
    userId: string
  ): Promise<TConversation> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const group = demoGroupConversations.find((g) => g.conversationId === conversationId);
    if (!group) throw new Error("Group not found");
    if (group.participants) {
      group.participants = group.participants.filter((p) => p !== userId);
    }
    return group;
  },
};

/**
 * Call Management
 */
export const callService = {
  // Get call history
  async getCallHistory(userId?: string): Promise<{callId: string; type: string; initiator: string; participant: string; duration: number; status: string; createdAt: Date}[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (userId) {
      return demoCallLogs.filter(
        (call) => call.initiator === userId || call.participant === userId
      );
    }
    return demoCallLogs;
  },

  // Initiate a call
  async initiateCall(data: {
    type: "voice" | "video";
    recipientId: string;
  }): Promise<{callId: string; type: string; initiator: string; participant: string; startedAt: Date; status: string}> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return {
      callId: `call-${Date.now()}`,
      type: data.type,
      initiator: "admin-001",
      participant: data.recipientId,
      startedAt: new Date(),
      status: "connecting",
    };
  },

  // End a call
  async endCall(callId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const call = demoCallLogs.find((c) => c.callId === callId);
    if (call) {
      call.status = "completed";
    }
  },

  // Decline a call
  async declineCall(callId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const call = demoCallLogs.find((c) => c.callId === callId);
    if (call) {
      call.status = "declined";
    }
  },
};

/**
 * Notification Management
 */
export const notificationService = {
  // Fetch notifications
  async fetchNotifications(): Promise<{notificationId: string; type: string; title: string; description: string; conversationId: string | null; senderId: string; senderName: string; read: boolean; createdAt: Date}[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return demoNotifications;
  },

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return demoNotifications.filter((n) => !n.read).length;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const notification = demoNotifications.find((n) => n.notificationId === notificationId);
    if (notification) {
      notification.read = true;
    }
  },

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    demoNotifications.forEach((n) => {
      n.read = true;
    });
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const index = demoNotifications.findIndex((n) => n.notificationId === notificationId);
    if (index > -1) {
      demoNotifications.splice(index, 1);
    }
  },
};
