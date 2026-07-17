# Chat Service - Approach & Summary

## 📋 Service Overview

**Service Name:** Chat Service  
**Port:** 3006  
**Database:** MongoDB 7+ (Primary)  
**Real-time:** Socket.io  
**Message Queue:** Apache Kafka  
**Cache:** Redis 7+ (for online status, typing indicators)

---

## 🎯 Core Functionality

The Chat Service handles **three distinct chat types** with different business rules:

### 1. **Live Chat** (General Support)
- User/Agency → Admin communication
- Topic-based conversations
- Message history auto-deletion after 15 minutes offline
- Rating system (Yes/No)

### 2. **Order Chat** (Order-Specific)
- User/Agency ↔ Admin communication
- Only available when order status is "Pending" or "Working"
- Message auto-deletion after 7 days
- Admin assignment based on first reply

### 3. **Agency Chat** (Agency-Specific)
- Agency ↔ Admin communication
- Only available when agency status is "Active"
- Message auto-deletion after 7 days
- Admin assignment based on first reply

---

## 🏗️ Architecture Components

### **Database Schema (MongoDB)**

#### Collections:
1. **`chat_conversations`**
   ```typescript
   {
     _id: ObjectId,
     type: 'live' | 'order' | 'agency',
     participants: [userId, adminId?],
     orderId?: string, // For order chat
     topic?: string, // For live chat
     assignedAdminId?: string,
     status: 'active' | 'closed' | 'blocked',
     lastMessage: ObjectId,
     unreadCount: { [userId]: number },
     messageEnabled: boolean,
     callEnabled: boolean,
     fileUploadEnabled: boolean,
     voiceUploadEnabled: boolean,
     createdAt: Date,
     updatedAt: Date,
     expiresAt: Date, // TTL for auto-deletion
     customExpiration?: Date, // Admin-set expiration
     rating?: 'yes' | 'no',
     blockedBy?: string, // Admin who blocked
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **`chat_messages`**
   ```typescript
   {
     _id: ObjectId,
     conversationId: ObjectId,
     senderId: string,
     senderType: 'user' | 'agency' | 'admin' | 'sub-admin',
     content?: string, // Text message
     messageType: 'text' | 'file' | 'voice' | 'call',
     attachments?: [{
       filename: string,
       url: string,
       mimeType: string,
       size: number
     }],
     voiceUrl?: string,
     callDuration?: number, // For call messages
     readBy: [{
       userId: string,
       readAt: Date
     }],
     createdAt: Date,
     updatedAt: Date
   }
   ```

3. **`typing_indicators`** (Redis + MongoDB)
   ```typescript
   {
     conversationId: ObjectId,
     userId: string,
     isTyping: boolean,
     lastTypingAt: Date
   }
   ```

4. **`predefined_messages`** (Admin)
   ```typescript
   {
     _id: ObjectId,
     adminId: string,
     title: string,
     content: string,
     category?: string,
     createdAt: Date,
     updatedAt: Date
   }
   ```

5. **`chat_assignments`** (Admin routing)
   ```typescript
   {
     _id: ObjectId,
     conversationId: ObjectId,
     adminId: string,
     assignedAt: Date,
     unassignedAt?: Date,
     reason?: string // 'offline_timeout' | 'manual' | 'auto'
   }
   ```

---

## 🔌 REST API Endpoints

### **Conversation Management**

#### Live Chat
- `POST /api/chat/live/conversations` - Create live chat conversation (select topic)
- `GET /api/chat/live/conversations` - Get user's live chat conversations
- `GET /api/chat/live/conversations/:id` - Get conversation details
- `POST /api/chat/live/conversations/:id/rating` - Submit rating (Yes/No)
- `DELETE /api/chat/live/conversations/:id` - Close conversation

#### Order Chat
- `POST /api/chat/order/conversations` - Create order chat (validates order status)
- `GET /api/chat/order/conversations` - Get order conversations
- `GET /api/chat/order/conversations/:orderId` - Get conversation by order ID
- `GET /api/chat/order/conversations/:id` - Get conversation details

#### Agency Chat
- `POST /api/chat/agency/conversations` - Create agency chat (validates agency status)
- `GET /api/chat/agency/conversations` - Get agency conversations
- `GET /api/chat/agency/conversations/:id` - Get conversation details

### **Message Management**

- `GET /api/chat/conversations/:id/messages` - Get messages (paginated)
- `POST /api/chat/conversations/:id/messages` - Send text message
- `POST /api/chat/conversations/:id/messages/file` - Upload file message
- `POST /api/chat/conversations/:id/messages/voice` - Upload voice message
- `POST /api/chat/conversations/:id/messages/call` - Log call message
- `PUT /api/chat/messages/:id/read` - Mark message as read
- `DELETE /api/chat/messages/:id` - Delete message (soft delete)

### **Admin Endpoints**

#### Conversation Management
- `GET /api/chat/admin/conversations` - Get all conversations (with filters)
- `GET /api/chat/admin/conversations/requests` - Get unassigned conversations
- `GET /api/chat/admin/conversations/assigned` - Get assigned conversations
- `POST /api/chat/admin/conversations/:id/assign` - Assign conversation to admin
- `POST /api/chat/admin/conversations/:id/unassign` - Unassign conversation
- `POST /api/chat/admin/conversations/:id/forward` - Forward to another admin
- `PUT /api/chat/admin/conversations/:id/expiration` - Set custom expiration

#### User Controls
- `POST /api/chat/admin/conversations/:id/block` - Block user/agency
- `POST /api/chat/admin/conversations/:id/unblock` - Unblock user/agency
- `PUT /api/chat/admin/conversations/:id/message-toggle` - Enable/disable messaging
- `PUT /api/chat/admin/conversations/:id/call-toggle` - Enable/disable calling
- `PUT /api/chat/admin/conversations/:id/file-toggle` - Enable/disable file uploads
- `PUT /api/chat/admin/conversations/:id/voice-toggle` - Enable/disable voice uploads

#### Predefined Messages
- `GET /api/chat/admin/predefined-messages` - Get all predefined messages
- `POST /api/chat/admin/predefined-messages` - Create predefined message
- `PUT /api/chat/admin/predefined-messages/:id` - Update predefined message
- `DELETE /api/chat/admin/predefined-messages/:id` - Delete predefined message

#### Analytics
- `GET /api/chat/admin/stats` - Get chat statistics
- `GET /api/chat/admin/conversations/:id/history` - Get conversation history

### **Health & Status**
- `GET /api/chat/health` - Health check
- `GET /api/chat/status` - Service status

---

## 🔌 Socket.io Events

### **Client → Server Events**

#### Connection & Presence
- `join:conversation` - Join conversation room
- `leave:conversation` - Leave conversation room
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `online:status` - Update online status

#### Messaging
- `message:send` - Send text message
- `message:read` - Mark message as read
- `call:initiate` - Request to initiate call (validates rules)
- `call:end` - End call

### **Server → Client Events**

#### Real-time Updates
- `message:new` - New message received
- `message:read` - Message read confirmation
- `typing:status` - Typing indicator update
- `online:status` - Online status update
- `conversation:assigned` - Conversation assigned to admin
- `conversation:unassigned` - Conversation unassigned
- `conversation:blocked` - Conversation blocked
- `conversation:updated` - Conversation settings updated
- `call:request` - Incoming call request
- `call:accepted` - Call accepted
- `call:rejected` - Call rejected
- `call:ended` - Call ended

---

## 🔐 Business Rules & Validations

### **Live Chat Rules**
1. ✅ User/Agency can select topic and start conversation
2. ✅ Message history deleted after 15 minutes offline (if not returned within 15 min)
3. ✅ Rating can be submitted after chat ends
4. ✅ Admin assignment on first reply
5. ✅ File/voice upload only after admin replies
6. ✅ Call only after admin replies

### **Order Chat Rules**
1. ✅ Only available when order status is "Pending" or "Working"
2. ✅ Messages auto-deleted after 7 days (or custom expiration)
3. ✅ Initially sent to all admins/sub-admins
4. ✅ Assigned to first admin who replies
5. ✅ Re-assigned to all if assigned admin offline for 10 minutes
6. ✅ File/voice upload only after admin replies
7. ✅ Call only after admin replies

### **Agency Chat Rules**
1. ✅ Only available when agency status is "Active"
2. ✅ Messages auto-deleted after 7 days (or custom expiration)
3. ✅ Initially sent to all admins/sub-admins
4. ✅ Assigned to first admin who replies
5. ✅ Re-assigned to all if assigned admin offline for 10 minutes
6. ✅ File/voice upload only after admin replies
7. ✅ Call only after admin replies

### **File Upload Rules**
- ✅ Max file size: 1MB (as per documentation)
- ✅ Allowed types: PDF, images, audio, video
- ✅ Only after admin replies to first message
- ✅ Antivirus scanning (if available)

### **Voice Upload Rules**
- ✅ Only after admin replies to first voice message
- ✅ Max duration: TBD
- ✅ Format: MP3/WAV

### **Call Rules**
- ✅ Only after admin replies to first message
- ✅ WebRTC integration (future)
- ✅ Call logging and duration tracking

---

## 🔄 Integration Points

### **External Services**

1. **SSO Service (Port 3001)**
   - JWT token validation
   - User/Agency/Admin authentication
   - Role-based access control

2. **Order Service (Port 3003)**
   - Validate order status for order chat
   - Get order details

3. **User Profile Service (Port 3005)**
   - Get user/agency profile information
   - Get profile photos/logos

4. **Admin Service (Port 3007)**
   - Get admin/sub-admin permissions
   - Validate admin access

5. **File Storage Service (Port 3009)**
   - Upload files/voice messages
   - Get file URLs

6. **Notification Service (Port 3008)**
   - Send notifications for new messages
   - Send notifications for assignments

7. **Kafka (Message Queue)**
   - Publish message events
   - Subscribe to order status changes
   - Subscribe to agency status changes

8. **Redis (Cache)**
   - Online/offline status
   - Typing indicators
   - Rate limiting
   - Session management

---

## 📦 Service Structure

```
apps/chat/
├── src/
│   ├── main.ts                          # Bootstrap application
│   ├── app.module.ts                    # Root module
│   │
│   ├── common/
│   │   ├── auth.guard.ts                # JWT authentication guard
│   │   ├── roles.guard.ts               # Role-based access guard
│   │   ├── chat-rules.guard.ts          # Chat-specific business rules guard
│   │   └── decorators/
│   │       ├── current-user.decorator.ts
│   │       └── chat-type.decorator.ts
│   │
│   ├── conversation/
│   │   ├── conversation.module.ts
│   │   ├── conversation.controller.ts  # REST endpoints
│   │   ├── conversation.service.ts       # Business logic
│   │   ├── conversation.gateway.ts      # Socket.io gateway
│   │   ├── dto/
│   │   │   ├── create-conversation.dto.ts
│   │   │   ├── update-conversation.dto.ts
│   │   │   └── filter-conversation.dto.ts
│   │   └── schemas/
│   │       └── conversation.schema.ts    # Mongoose schema
│   │
│   ├── message/
│   │   ├── message.module.ts
│   │   ├── message.controller.ts
│   │   ├── message.service.ts
│   │   ├── message.gateway.ts            # Socket.io events
│   │   ├── dto/
│   │   │   ├── create-message.dto.ts
│   │   │   ├── file-message.dto.ts
│   │   │   └── voice-message.dto.ts
│   │   └── schemas/
│   │       └── message.schema.ts
│   │
│   ├── admin/
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts           # Admin endpoints
│   │   ├── admin.service.ts
│   │   ├── dto/
│   │   │   ├── assign-conversation.dto.ts
│   │   │   ├── block-user.dto.ts
│   │   │   └── set-expiration.dto.ts
│   │   └── schemas/
│   │       └── predefined-message.schema.ts
│   │
│   ├── gateway/
│   │   ├── chat.gateway.ts               # Main Socket.io gateway
│   │   ├── presence.service.ts           # Online/offline tracking
│   │   └── typing.service.ts             # Typing indicators
│   │
│   ├── rules/
│   │   ├── chat-rules.service.ts          # Business rules validation
│   │   ├── order-chat-validator.ts       # Order chat validation
│   │   ├── agency-chat-validator.ts      # Agency chat validation
│   │   └── file-upload-validator.ts      # File upload validation
│   │
│   ├── scheduler/
│   │   ├── scheduler.module.ts
│   │   ├── message-cleanup.service.ts    # Auto-delete expired messages
│   │   └── assignment-timeout.service.ts # Re-assign on admin timeout
│   │
│   ├── integration/
│   │   ├── integration.module.ts
│   │   ├── sso-client.service.ts         # SSO service client
│   │   ├── order-client.service.ts       # Order service client
│   │   ├── user-profile-client.service.ts
│   │   └── file-storage-client.service.ts
│   │
│   ├── kafka/
│   │   ├── kafka.module.ts
│   │   ├── kafka.producer.service.ts     # Publish events
│   │   └── kafka.consumer.service.ts     # Subscribe to events
│   │
│   └── health/
│       ├── health.module.ts
│       └── health.controller.ts
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── nest-cli.json
└── env.template
```

---

## 🔧 Key Features Implementation

### **1. Real-time Messaging (Socket.io)**
- WebSocket connections with JWT authentication
- Room-based messaging (one room per conversation)
- Presence detection (online/offline)
- Typing indicators
- Read receipts

### **2. Admin Assignment Logic**
- Round-robin or load-based assignment
- Auto-assignment on first reply
- Re-assignment on admin timeout (10 minutes)
- Manual assignment/forwarding

### **3. Message Expiration**
- TTL indexes in MongoDB
- Scheduled cleanup jobs
- Custom expiration per conversation (admin-set)
- 7 days default for order/agency chat
- 15 minutes offline for live chat

### **4. File & Voice Upload**
- Integration with File Storage Service
- Validation of upload permissions
- File type and size validation
- Antivirus scanning (if available)

### **5. Call Management**
- WebRTC signaling (future)
- Call request/accept/reject flow
- Call duration tracking
- Call history logging

### **6. Rating System**
- Post-chat rating (Yes/No)
- Rating storage and analytics
- Admin dashboard integration

### **7. Predefined Messages**
- Admin-managed message templates
- Quick response functionality
- Categorization support

---

## 📊 Required Environment Variables

```env
# Service Configuration
PORT=3006
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/chat_db
MONGODB_DB_NAME=chat_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# SSO Service
SSO_SERVICE_URL=http://localhost:3001
SSO_PUBLIC_KEY_PATH=/path/to/public-key.pem

# External Services
ORDER_SERVICE_URL=http://localhost:3003
USER_PROFILE_SERVICE_URL=http://localhost:3005
ADMIN_SERVICE_URL=http://localhost:3007
FILE_STORAGE_SERVICE_URL=http://localhost:3009
NOTIFICATION_SERVICE_URL=http://localhost:3008

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=chat-service
KAFKA_GROUP_ID=chat-service-group

# File Upload
MAX_FILE_SIZE=1048576  # 1MB in bytes
ALLOWED_FILE_TYPES=pdf,image/*,audio/*,video/*

# Message Expiration
ORDER_CHAT_EXPIRATION_DAYS=7
AGENCY_CHAT_EXPIRATION_DAYS=7
LIVE_CHAT_OFFLINE_TIMEOUT_MINUTES=15
ADMIN_TIMEOUT_MINUTES=10

# Security
JWT_SECRET=
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

---

## 🧪 Testing Strategy

### **Unit Tests**
- Conversation service logic
- Message service logic
- Business rules validation
- Admin assignment logic

### **Integration Tests**
- REST API endpoints
- Socket.io events
- Database operations
- External service integrations

### **E2E Tests**
- Complete chat flow
- Admin assignment flow
- File upload flow
- Message expiration

---

## 📈 Performance Considerations

1. **MongoDB Indexing**
   - Index on `conversationId` in messages
   - Index on `participants` in conversations
   - Index on `expiresAt` for TTL
   - Index on `orderId` for order chat
   - Compound indexes for common queries

2. **Redis Caching**
   - Online status caching
   - Typing indicators
   - Recent messages cache
   - Admin availability cache

3. **Socket.io Optimization**
   - Room-based messaging (reduce broadcast overhead)
   - Connection pooling
   - Message batching

4. **Database Optimization**
   - Pagination for message history
   - Lazy loading of attachments
   - Archive old conversations

---

## 🔒 Security Considerations

1. **Authentication**
   - JWT token validation on all endpoints
   - Socket.io connection authentication
   - Role-based access control

2. **Authorization**
   - User can only access their conversations
   - Admin can access assigned conversations
   - Sub-admin permissions validation

3. **Input Validation**
   - Message content sanitization
   - File type validation
   - Size limits enforcement

4. **Rate Limiting**
   - Per-user message rate limits
   - File upload rate limits
   - Connection rate limits

---

## 📝 Summary

The Chat Service is a **standalone microservice** that handles:

✅ **3 Chat Types:** Live, Order, Agency  
✅ **Real-time Communication:** Socket.io WebSocket  
✅ **Message Management:** CRUD operations with expiration  
✅ **Admin Assignment:** Auto and manual assignment  
✅ **File & Voice Support:** Upload and management  
✅ **Call Management:** WebRTC integration (future)  
✅ **Business Rules:** Complex validation logic  
✅ **Integration:** Multiple external services  
✅ **Scalability:** Kafka, Redis, MongoDB  

**Total REST Endpoints:** ~25-30  
**Socket.io Events:** ~15-20  
**MongoDB Collections:** 5  
**External Integrations:** 7 services


