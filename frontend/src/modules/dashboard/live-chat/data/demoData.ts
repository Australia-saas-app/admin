/**
 * Demo Data for Live Chat
 * TODO: Replace with real data from backend API
 */

import type { TConversation, TMessage } from "../types";

// Demo users for conversations
export const demoUsers = [
  {
    id: "user-001",
    name: "Liam Anderson",
    email: "liam@example.com",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    status: "online",
    lastSeen: new Date(Date.now() - 2 * 60000),
    role: "user",
  },
  {
    id: "user-002",
    name: "Lucas Williams",
    email: "lucas@example.com",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    status: "online",
    lastSeen: new Date(Date.now() - 5 * 60000),
    role: "affiliate",
  },
  {
    id: "user-003",
    name: "Grace Miller",
    email: "grace@example.com",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    status: "offline",
    lastSeen: new Date(Date.now() - 30 * 60000),
    role: "user",
  },
  {
    id: "user-004",
    name: "Sophia Chen",
    email: "sophia@example.com",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    status: "online",
    lastSeen: new Date(),
    role: "user",
  },
  {
    id: "user-005",
    name: "Benjamin Knight",
    email: "benjamin@example.com",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    status: "offline",
    lastSeen: new Date(Date.now() - 120 * 60000),
    role: "affiliate",
  },
];

// Demo conversations
export const demoConversations: TConversation[] = [
  {
    _id: "conv-001",
    conversationId: "conv-001",
    type: "live",
    senderId: "user-001",
    senderName: "Liam Anderson",
    receiverId: "admin-001",
    receiverName: "Admin User",
    serviceType: "Technical",
    lastMessage: "I can't log in to my account",
    unreadCount: 2,
    createdAt: new Date(Date.now() - 2 * 3600000),
    updatedAt: new Date(Date.now() - 5 * 60000),
  },
  {
    _id: "conv-002",
    conversationId: "conv-002",
    type: "live",
    senderId: "user-002",
    senderName: "Lucas Williams",
    receiverId: "admin-001",
    receiverName: "Admin User",
    serviceType: "Business",
    lastMessage: "Can you help with my business account?",
    unreadCount: 1,
    createdAt: new Date(Date.now() - 4 * 3600000),
    updatedAt: new Date(Date.now() - 10 * 60000),
  },
  {
    _id: "conv-003",
    conversationId: "conv-003",
    type: "live",
    senderId: "user-003",
    senderName: "Grace Miller",
    receiverId: "admin-001",
    receiverName: "Admin User",
    serviceType: "Affiliate",
    lastMessage: "Thanks for your help!",
    unreadCount: 0,
    createdAt: new Date(Date.now() - 6 * 3600000),
    updatedAt: new Date(Date.now() - 35 * 60000),
  },
];

// Demo messages
export const demoMessages: TMessage[] = [
  {
    _id: "msg-001",
    type: "live",
    senderId: "user-001",
    senderName: "Liam Anderson",
    receiverId: "admin-001",
    receiverName: "Admin User",
    content: "Hi, I need help with my account",
    conversationId: "conv-001",
    authority: "user",
    serviceType: "Technical",
    createdAt: new Date(Date.now() - 120 * 60000),
    updatedAt: new Date(Date.now() - 120 * 60000),
  },
  {
    _id: "msg-002",
    type: "live",
    senderId: "admin-001",
    senderName: "Admin User",
    receiverId: "user-001",
    receiverName: "Liam Anderson",
    content: "Hello! I'm here to help. What's the issue?",
    conversationId: "conv-001",
    authority: "admin",
    serviceType: "Technical",
    createdAt: new Date(Date.now() - 118 * 60000),
    updatedAt: new Date(Date.now() - 118 * 60000),
  },
  {
    _id: "msg-003",
    type: "live",
    senderId: "user-001",
    senderName: "Liam Anderson",
    receiverId: "admin-001",
    receiverName: "Admin User",
    content: "I can't log in to my account",
    conversationId: "conv-001",
    authority: "user",
    serviceType: "Technical",
    createdAt: new Date(Date.now() - 115 * 60000),
    updatedAt: new Date(Date.now() - 115 * 60000),
  },
  {
    _id: "msg-004",
    type: "live",
    senderId: "admin-001",
    senderName: "Admin User",
    receiverId: "user-001",
    receiverName: "Liam Anderson",
    content: "Let me check your account details. Please provide your email address.",
    conversationId: "conv-001",
    authority: "admin",
    serviceType: "Technical",
    createdAt: new Date(Date.now() - 110 * 60000),
    updatedAt: new Date(Date.now() - 110 * 60000),
  },
  {
    _id: "msg-005",
    type: "live",
    senderId: "user-002",
    senderName: "Lucas Williams",
    receiverId: "admin-001",
    receiverName: "Admin User",
    content: "Do you have any promotional offers?",
    conversationId: "conv-002",
    authority: "user",
    serviceType: "Business",
    createdAt: new Date(Date.now() - 240 * 60000),
    updatedAt: new Date(Date.now() - 240 * 60000),
  },
  {
    _id: "msg-006",
    type: "live",
    senderId: "admin-001",
    senderName: "Admin User",
    receiverId: "user-002",
    receiverName: "Lucas Williams",
    content: "Yes! We have 20% off for new members this month.",
    conversationId: "conv-002",
    authority: "admin",
    serviceType: "Business",
    deliveryStatus: "read",
    readAt: new Date(Date.now() - 12 * 60000),
    createdAt: new Date(Date.now() - 13 * 60000),
    updatedAt: new Date(Date.now() - 13 * 60000),
  },
  {
    _id: "msg-007",
    type: "live",
    senderId: "user-002",
    senderName: "Lucas Williams",
    receiverId: "admin-001",
    receiverName: "Admin User",
    content: "Can you help with my business account?",
    conversationId: "conv-002",
    authority: "user",
    serviceType: "Business",
    deliveryStatus: "delivered",
    createdAt: new Date(Date.now() - 10 * 60000),
    updatedAt: new Date(Date.now() - 10 * 60000),
  },
  {
    _id: "msg-008",
    type: "live",
    senderId: "user-003",
    senderName: "Grace Miller",
    receiverId: "admin-001",
    receiverName: "Admin User",
    content: "Hello, I need assistance with affiliate program",
    conversationId: "conv-003",
    authority: "user",
    serviceType: "Affiliate",
    deliveryStatus: "read",
    readAt: new Date(Date.now() - 30 * 60000),
    createdAt: new Date(Date.now() - 40 * 60000),
    updatedAt: new Date(Date.now() - 40 * 60000),
  },
  {
    _id: "msg-009",
    type: "live",
    senderId: "admin-001",
    senderName: "Admin User",
    receiverId: "user-003",
    receiverName: "Grace Miller",
    content: "Hi Grace! I can help you with that. What specific information do you need?",
    conversationId: "conv-003",
    authority: "admin",
    serviceType: "Affiliate",
    deliveryStatus: "read",
    readAt: new Date(Date.now() - 35 * 60000),
    createdAt: new Date(Date.now() - 38 * 60000),
    updatedAt: new Date(Date.now() - 38 * 60000),
  },
  {
    _id: "msg-010",
    type: "live",
    senderId: "user-003",
    senderName: "Grace Miller",
    receiverId: "admin-001",
    receiverName: "Admin User",
    content: "Thanks for your help!",
    conversationId: "conv-003",
    authority: "user",
    serviceType: "Affiliate",
    deliveryStatus: "read",
    readAt: new Date(Date.now() - 35 * 60000),
    createdAt: new Date(Date.now() - 35 * 60000),
    updatedAt: new Date(Date.now() - 35 * 60000),
  },
];

// Demo delivery statuses
export const demoDeliveryStatuses = {
  "msg-001": "read",
  "msg-002": "read",
  "msg-003": "read",
  "msg-004": "read",
  "msg-005": "read",
  "msg-006": "delivered",
};

// Demo typing indicators
export const demoTypingIndicators = {
  "user-001": false,
  "user-002": false,
  "user-003": false,
};

// Demo group conversations (Admin/Sub-admin features)
export const demoGroupConversations: TConversation[] = [
  {
    _id: "group-001",
    conversationId: "group-001",
    type: "live",
    senderId: "admin-001",
    senderName: "Admin User",
    serviceType: "Group",
    groupName: "Support Team",
    groupAvatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    participants: ["admin-001", "user-001", "user-002"],
    createdBy: "admin-001",
    createdAt: new Date(Date.now() - 30 * 24 * 3600000),
    isGroup: true,
  },
  {
    _id: "group-002",
    conversationId: "group-002",
    type: "live",
    senderId: "admin-001",
    senderName: "Admin User",
    serviceType: "Group",
    groupName: "Affiliate Network",
    groupAvatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    participants: ["admin-001", "user-002", "user-005"],
    createdBy: "admin-001",
    createdAt: new Date(Date.now() - 15 * 24 * 3600000),
    isGroup: true,
  },
];

// Demo call logs
export const demoCallLogs = [
  {
    callId: "call-001",
    type: "voice",
    initiator: "admin-001",
    participant: "user-001",
    duration: 5 * 60, // 5 minutes
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    callId: "call-002",
    type: "video",
    initiator: "user-002",
    participant: "admin-001",
    duration: 12 * 60, // 12 minutes
    status: "completed",
    createdAt: new Date(Date.now() - 6 * 3600000),
  },
  {
    callId: "call-003",
    type: "voice",
    initiator: "admin-001",
    participant: "user-003",
    duration: 0,
    status: "missed",
    createdAt: new Date(Date.now() - 24 * 3600000),
  },
];

// Demo notifications
export const demoNotifications = [
  {
    notificationId: "notif-001",
    type: "new_message",
    title: "New message from Liam Anderson",
    description: "Hi, I need help with my account",
    conversationId: "conv-001",
    senderId: "user-001",
    senderName: "Liam Anderson",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000),
  },
  {
    notificationId: "notif-002",
    type: "new_message",
    title: "New message from Lucas Williams",
    description: "Do you have any promotional offers?",
    conversationId: "conv-002",
    senderId: "user-002",
    senderName: "Lucas Williams",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    notificationId: "notif-003",
    type: "user_online",
    title: "Sophia Chen is now online",
    description: "User is online",
    conversationId: null,
    senderId: "user-004",
    senderName: "Sophia Chen",
    read: true,
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    notificationId: "notif-004",
    type: "missed_call",
    title: "Missed voice call from Grace Miller",
    description: "Missed call",
    conversationId: "conv-003",
    senderId: "user-003",
    senderName: "Grace Miller",
    read: true,
    createdAt: new Date(Date.now() - 2 * 3600000),
  },
];

// Demo message search results
export const searchMessages = (query: string, messages: TMessage[]): TMessage[] => {
  if (!query.trim()) return messages;
  const lowerQuery = query.toLowerCase();
  return messages.filter((msg) =>
    msg.content.toLowerCase().includes(lowerQuery) ||
    msg.senderName.toLowerCase().includes(lowerQuery)
  );
};

// Demo message filter by service type
export const filterMessagesByService = (
  serviceType: string,
  messages: TMessage[]
): TMessage[] => {
  if (!serviceType) return messages;
  return messages.filter((msg) => msg.serviceType === serviceType);
};

// Demo message filter by authority
export const filterMessagesByAuthority = (
  authority: string,
  messages: TMessage[]
): TMessage[] => {
  if (!authority) return messages;
  return messages.filter((msg) => msg.authority === authority);
};
