# Postman Collection Setup Guide

## 📦 Import Collection

1. Open Postman
2. Click **Import** button
3. Select `Chat_Service.postman_collection.json`
4. Collection will be imported with all folders and requests

## 🔧 Configure Variables

After importing, set up collection variables:

1. Click on **Chat Service API** collection
2. Go to **Variables** tab
3. Set the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:3006/api/chat` | Base URL for Chat Service |
| `jwt_token` | `YOUR_USER_JWT_TOKEN` | User JWT token from SSO Service |
| `admin_token` | `YOUR_ADMIN_JWT_TOKEN` | Admin JWT token from Admin Service |

## 🔑 Getting JWT Tokens

### User Token
1. Login via SSO Service: `POST http://localhost:3001/api/sso/auth/login`
2. Copy the `access_token` from response
3. Paste it in `jwt_token` variable

### Admin Token
1. Login via Admin Service: `POST http://localhost:3007/api/admin/auth/login`
2. Copy the `access_token` from response
3. Paste it in `admin_token` variable

## 📋 Collection Structure

### 1. Health
- ✅ Health Check

### 2. Live Chat
- ✅ Create Live Chat
- ✅ Get Live Chat Conversations
- ✅ Get Conversation by ID
- ✅ Submit Rating
- ✅ Close Conversation

### 3. Order Chat
- ✅ Create Order Chat
- ✅ Get Order Chat Conversations
- ✅ Get Conversation by Order ID

### 4. Agency Chat
- ✅ Create Agency Chat
- ✅ Get Agency Chat Conversations

### 5. Messages
- ✅ Send Text Message
- ✅ Upload File Message
- ✅ Upload Voice Message
- ✅ Log Call Message
- ✅ Get Messages
- ✅ Mark Message as Read
- ✅ Delete Message

### 6. Admin - Conversations
- ✅ Get All Conversations
- ✅ Get Unassigned Conversations
- ✅ Get Assigned Conversations
- ✅ Get Assigned Users List
- ✅ Assign Conversation
- ✅ Unassign Conversation
- ✅ Forward Conversation
- ✅ Block User
- ✅ Unblock User
- ✅ Toggle Messaging
- ✅ Toggle Calling
- ✅ Toggle File Upload
- ✅ Toggle Voice Upload
- ✅ Set Custom Expiration
- ✅ Get User Profile for Display
- ✅ Get Agency Profile for Display

### 7. Admin - Predefined Messages
- ✅ Get Predefined Messages
- ✅ Create Predefined Message
- ✅ Update Predefined Message
- ✅ Delete Predefined Message
- ✅ Assign Topic to Sub-Admins

### 8. Admin - Statistics
- ✅ Get Chat Statistics

## 🧪 Testing Workflow

### Step 1: Health Check
1. Run **Health Check** request (no auth required)
2. Should return: `{ "status": "ok", "service": "chat-service" }`

### Step 2: Create Live Chat
1. Set `jwt_token` variable with user token
2. Run **Create Live Chat** with topic: "Technical Support"
3. Save the `_id` from response as `conversationId`

### Step 3: Send Message
1. Update `:conversationId` path variable with saved ID
2. Run **Send Text Message**
3. Save the `_id` from response as `messageId`

### Step 4: Admin Actions
1. Set `admin_token` variable with admin token
2. Run **Get Unassigned Conversations** to see new chat
3. Run **Assign Conversation** to assign to admin
4. Run **Get Assigned Conversations** to verify

### Step 5: Test File Upload
1. Run **Upload File Message**
2. Select a file (max 1MB)
3. Add optional caption
4. Should upload and create message

## 🔍 Path Variables

Some requests use path variables that need to be set:

- `:conversationId` - Conversation ID from create response
- `:messageId` - Message ID from send message response
- `:orderId` - Order ID (e.g., "ORD000001")
- `:userId` - User ID
- `:agencyId` - Agency ID

## 📝 Example Responses

### Create Live Chat Response
```json
{
  "_id": "65f1234567890abcdef12345",
  "type": "live",
  "participants": ["user123"],
  "topic": "Technical Support",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Send Message Response
```json
{
  "_id": "65f1234567890abcdef12346",
  "conversationId": "65f1234567890abcdef12345",
  "senderId": "user123",
  "senderType": "user",
  "content": "Hello, I need help!",
  "messageType": "text",
  "createdAt": "2024-01-15T10:31:00.000Z"
}
```

## ⚠️ Important Notes

1. **Authentication**: All endpoints (except `/health`) require JWT Bearer token
2. **File Size**: File uploads limited to 1MB
3. **File Types**: Allowed: PDF, images, audio, video
4. **Order Chat**: Only works when order status is "Pending" or "Working"
5. **Agency Chat**: Only works when agency status is "Active"
6. **Admin Timeout**: Admin offline for 10 minutes triggers re-assignment
7. **Message Expiration**: 
   - Order/Agency chat: 7 days
   - Live chat: 15 minutes offline

## 🐛 Troubleshooting

### 401 Unauthorized
- Check if JWT token is valid
- Verify token hasn't expired
- Ensure token is in `Authorization: Bearer <token>` format

### 400 Bad Request
- Check request body format
- Verify required fields are present
- Check file size (max 1MB)

### 403 Forbidden
- Verify user has permission for the action
- Check if conversation is blocked
- Verify order/agency status for chat types

### 404 Not Found
- Verify conversation/message ID exists
- Check if user has access to the conversation

## 🔌 WebSocket Testing

For Socket.io testing, use a WebSocket client:

**Connection URL**: `ws://localhost:3006/chat`

**Authentication**: Pass token in connection:
```javascript
const socket = io('http://localhost:3006/chat', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});
```

**Test Events**:
- `join:conversation` - Join conversation room
- `message:send` - Send real-time message
- `typing:start` - Start typing indicator
- `call:initiate` - Initiate call

