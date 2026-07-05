# Live Chat System - Admin Dashboard

## Overview

Comprehensive real-time chat system with messaging, calls, groups, and notifications. Built with demo data, ready for backend API integration.

## Features Implemented

### 1. **Messaging**
- ✅ Real-time text messaging (via Socket.io)
- ✅ Message delivery status tracking (Sent → Delivered → Read)
- ✅ Typing indicators
- ✅ Message history with pagination
- ✅ Search and filter messages by service type and authority

**Files:**
- `services/chatService.ts` - Message operations
- `components/MainChatArea.tsx` - Message UI with delivery indicators

### 2. **Conversation Management**
- ✅ One-to-One conversations
- ✅ Conversation history
- ✅ Participant tracking
- ✅ Last seen timestamp

**Files:**
- `services/chatService.ts` - Conversation operations
- `data/demoData.ts` - Demo conversations

### 3. **Group Conversations (Admin Feature)**
- ✅ Create group chats
- ✅ Add/remove participants
- ✅ Group member management
- ✅ Multiple group support

**Files:**
- `components/GroupConversationManager.tsx` - Group creation UI
- `services/chatService.ts` - Group operations

### 4. **User Presence & Status**
- ✅ Online/Offline status
- ✅ Last seen tracking
- ✅ Typing indicators
- ✅ User presence synchronization

**Files:**
- `services/chatService.ts` - Presence operations
- `data/demoData.ts` - Demo user statuses

### 5. **Calls Management (Admin Feature)**
- ✅ Voice calls
- ✅ Video calls
- ✅ Call duration tracking
- ✅ Mute/unmute functionality
- ✅ Call history
- ✅ Call decline/end options

**Files:**
- `components/CallManager.tsx` - Call UI
- `components/actions/CallAction.tsx` - Call initiation buttons
- `services/chatService.ts` - Call operations

### 6. **Notifications & Unread Count**
- ✅ Push notifications for new messages
- ✅ Unread message counter
- ✅ User online notifications
- ✅ Missed call notifications
- ✅ Notification center dropdown
- ✅ Mark as read functionality

**Files:**
- `components/NotificationCenter.tsx` - Notification UI
- `services/chatService.ts` - Notification operations

### 7. **Delivery Status Tracking**
- ✅ Sent status
- ✅ Delivered status
- ✅ Read status with timestamp
- ✅ Failed status indicator
- ✅ Visual delivery icons in messages

**Files:**
- `types/index.ts` - DeliveryStatus type
- `components/MainChatArea.tsx` - Delivery status display

### 8. **Security & Access Control**
- ✅ Authority levels: user, sub_admin, admin
- ✅ Admin-only group creation
- ✅ Admin-only call initiation
- ✅ Service type filtering
- ✅ User role validation

## Demo Data Structure

### Users
```typescript
const demoUsers = [
  { id, name, email, avatar, status, lastSeen, role },
  // Online/Offline status management
]
```

### Conversations
```typescript
const demoConversations = [
  {
    conversationId,
    type: "live" | "order",
    senderId,
    senderName,
    receiverId,
    receiverName,
    serviceType: "Technical" | "Business" | "Affiliate",
    createdAt,
    updatedAt,
  }
]
```

### Messages
```typescript
const demoMessages = [
  {
    _id,
    type: "live" | "order",
    senderId,
    senderName,
    receiverId,
    content,
    conversationId,
    authority: "user" | "sub_admin" | "admin",
    serviceType,
    deliveryStatus: "sent" | "delivered" | "read" | "failed",
    createdAt,
  }
]
```

### Groups
```typescript
const demoGroupConversations = [
  {
    conversationId,
    groupName,
    groupAvatar,
    participants: string[],
    createdBy: "admin-001",
    isGroup: true,
  }
]
```

### Calls
```typescript
const demoCallLogs = [
  {
    callId,
    type: "voice" | "video",
    initiator,
    participant,
    duration: number, // in seconds
    status: "completed" | "declined" | "missed",
    createdAt,
  }
]
```

### Notifications
```typescript
const demoNotifications = [
  {
    notificationId,
    type: "new_message" | "user_online" | "missed_call",
    title,
    description,
    conversationId,
    senderId,
    senderName,
    read: boolean,
    createdAt,
  }
]
```

## Key Services

### Message Service
```typescript
messageService.sendMessage(message)
messageService.fetchMessages(conversationId)
messageService.searchMessages(query)
messageService.filterByService(serviceType)
messageService.filterByAuthority(authority)
```

### Conversation Service
```typescript
conversationService.fetchConversations()
conversationService.createConversation(data)
conversationService.getConversationDetails(id)
conversationService.updateConversation(id, updates)
```

### Presence Service
```typescript
presenceService.getOnlineUsers()
presenceService.getUserPresence(userId)
presenceService.updateUserPresence(userId, status)
presenceService.setTypingIndicator(conversationId, userId, isTyping)
```

### Group Service (Admin)
```typescript
groupConversationService.createGroupConversation({ groupName, participants })
groupConversationService.addParticipantToGroup(conversationId, userId)
groupConversationService.removeParticipantFromGroup(conversationId, userId)
```

### Call Service (Admin)
```typescript
callService.initiateCall({ type, recipientId })
callService.endCall(callId)
callService.declineCall(callId)
callService.getCallHistory(userId)
```

### Notification Service
```typescript
notificationService.fetchNotifications()
notificationService.getUnreadCount()
notificationService.markAsRead(notificationId)
notificationService.markAllAsRead()
notificationService.deleteNotification(notificationId)
```

## Context Hooks

### useChatContext
Provides access to chat state and methods:

```typescript
const {
  // State
  state,
  messages,
  onlineUsers,
  selectedUser,
  loading,

  // Methods
  updateSearch,
  updateReceiverId,
  updateIsChatSelect,
  updateSelectedUser,
  updateActiveTab,
  
  // Enhanced methods
  fetchConversations,
  fetchOnlineUsers,
  fetchGroupConversations,
  createGroupConversation,
  markAsRead,
  initiateCall,
  endCall,
  fetchNotifications,
  getUnreadCount,
} = useChatContext();
```

## Components

### Core Components
- **Header.tsx** - User profile and stats
- **OnlineUser.tsx** - List of online users/conversations
- **MainChatArea.tsx** - Message display and input
- **ChatLanding.tsx** - Empty state UI

### Feature Components
- **GroupConversationManager.tsx** - Create and manage groups
- **CallManager.tsx** - Active call UI
- **NotificationCenter.tsx** - Notifications dropdown
- **CallAction.tsx** - Voice/video call buttons
- **ChatAction.tsx** - Chat options menu
- **Profile.tsx** - User profile display

## Type Definitions

All types in `types/index.ts`:
- `TConversation` - Conversation data
- `TMessage` - Message data
- `UserPresence` - User status
- `DeliveryStatus` - Message delivery status
- `State` - Chat context state

## TODO: Backend Integration

Replace demo data with actual API calls:

1. **Message API**
   - POST `/api/messages/send` - Send message
   - GET `/api/conversations/:id/messages` - Fetch messages
   - PUT `/api/messages/:id/status` - Update delivery status

2. **Conversation API**
   - GET `/api/conversations` - List conversations
   - POST `/api/conversations` - Create conversation
   - GET `/api/conversations/:id` - Get details

3. **Group API**
   - POST `/api/groups` - Create group
   - PUT `/api/groups/:id/members` - Manage members
   - GET `/api/groups` - List groups

4. **Call API**
   - POST `/api/calls` - Initiate call
   - PUT `/api/calls/:id` - End call
   - GET `/api/calls/history` - Call history

5. **Notification API**
   - GET `/api/notifications` - List notifications
   - PUT `/api/notifications/:id/read` - Mark as read
   - GET `/api/notifications/unread/count` - Unread count

6. **Presence API**
   - GET `/api/users/online` - Online users
   - PUT `/api/presence/:userId` - Update presence

## Socket Events

Current implementation uses Socket.io with these events:

- `private_message` - Receive message
- `typing` - Typing indicator
- `presence` - User presence update
- `notification` - New notification
- `call_initiated` - Incoming call
- `call_ended` - Call ended

## Features Pending Implementation

- End-to-end encryption
- Message retention policies
- Advanced search with filters
- Message reactions
- File/media upload in messages
- Voice message support
- Read receipts with timestamps
- Message pinning
- Channel/room feature

## Color Scheme

- Primary Blue: `#3B82F6`
- Success Green: `#10B981`
- Error Red: `#EF4444`
- Warning Yellow: `#F59E0B`
- Text Gray: `#1F2937`
- Border Gray: `#E5E7EB`

## Responsive Design

- Mobile: Collapsible sidebar
- Tablet: Flexible layout
- Desktop: 2-column layout with sidebar
- Min height: 90vh (dashboard) / screen (fullscreen)

## Performance Optimizations

- Message pagination (50 per page)
- Conversation list memoization
- Lazy loading of notifications
- Debounced typing indicator
- Optimized re-renders with useCallback
- Virtual scrolling ready

---

**Last Updated:** December 7, 2025
**Status:** ✅ Complete with demo data, ready for backend integration
