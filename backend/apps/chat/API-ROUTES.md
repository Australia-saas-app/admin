# Chat Service - API Routes Summary

## Base URL
- **Development**: `http://localhost:3006/api/chat`
- **WebSocket**: `ws://localhost:3006/chat`
- **API Docs**: `http://localhost:3006/api/chat/docs`

---

## 🔐 Authentication
All endpoints (except `/health`) require JWT Bearer token:
```
Authorization: Bearer <token>
```

---

## 📋 Live Chat Endpoints

### Create Live Chat
```
POST /live/conversations
Body: { "topic": "Technical Support" }
```

### Get Live Chat Conversations
```
GET /live/conversations?page=1&limit=20&status=active
```

### Get Conversation by ID
```
GET /conversations/:id
```

### Submit Rating
```
POST /live/conversations/:id/rating
Body: { "rating": "yes" | "no" }
```

### Close Conversation
```
DELETE /conversations/:id
```

---

## 📦 Order Chat Endpoints

### Create Order Chat
```
POST /order/conversations
Body: { "orderId": "ORD000001" }
```

### Get Order Chat Conversations
```
GET /order/conversations?page=1&limit=20
```

### Get Conversation by Order ID
```
GET /order/conversations/:orderId
```

---

## 🏢 Agency Chat Endpoints

### Create Agency Chat
```
POST /agency/conversations
Body: { "topic": "Optional topic" }
```

### Get Agency Chat Conversations
```
GET /agency/conversations?page=1&limit=20
```

---

## 💬 Message Endpoints

### Send Text Message
```
POST /conversations/:conversationId/messages
Body: { "content": "Hello!" }
```

### Upload File Message
```
POST /conversations/:conversationId/messages/file
Content-Type: multipart/form-data
Body: file (form field), caption (optional)
```

### Upload Voice Message
```
POST /conversations/:conversationId/messages/voice
Content-Type: multipart/form-data
Body: voice (form field), caption (optional)
```

### Log Call Message
```
POST /conversations/:conversationId/messages/call
Body: { "callDuration": 120, "status": "completed" }
```

### Get Messages
```
GET /conversations/:conversationId/messages?page=1&limit=50&before=2024-01-01&after=2024-01-01
```

### Mark Message as Read
```
PUT /conversations/:conversationId/messages/:id/read
```

### Delete Message
```
DELETE /conversations/:conversationId/messages/:id
```

---

## 👨‍💼 Admin Endpoints

### Get All Conversations
```
GET /admin/conversations?page=1&limit=20&status=active&orderId=ORD001
```

### Get Unassigned Conversations
```
GET /admin/conversations/requests
```

### Get Assigned Conversations
```
GET /admin/conversations/assigned
```

### Assign Conversation
```
POST /admin/conversations/:id/assign
Body: { "adminId": "admin123" }
```

### Unassign Conversation
```
POST /admin/conversations/:id/unassign
```

### Forward Conversation
```
POST /admin/conversations/:id/forward
Body: { "targetAdminId": "admin456" }
```

### Block User
```
POST /admin/conversations/:id/block
Body: { "reason": "Spam" }
```

### Unblock User
```
POST /admin/conversations/:id/unblock
```

### Toggle Messaging
```
PUT /admin/conversations/:id/message-toggle
Body: { "enabled": true }
```

### Toggle Calling
```
PUT /admin/conversations/:id/call-toggle
Body: { "enabled": true }
```

### Toggle File Upload
```
PUT /admin/conversations/:id/file-toggle
Body: { "enabled": true }
```

### Toggle Voice Upload
```
PUT /admin/conversations/:id/voice-toggle
Body: { "enabled": true }
```

### Set Custom Expiration
```
PUT /admin/conversations/:id/expiration
Body: { "expirationDate": "2024-12-31T23:59:59Z" }
```

### Get Predefined Messages
```
GET /admin/predefined-messages
```

### Create Predefined Message
```
POST /admin/predefined-messages
Body: { "title": "Welcome", "content": "Hello! How can I help?", "category": "greeting" }
```

### Update Predefined Message
```
PUT /admin/predefined-messages/:id
Body: { "title": "Updated", "content": "New content" }
```

### Delete Predefined Message
```
DELETE /admin/predefined-messages/:id
```

### Get Statistics
```
GET /admin/stats
```

---

## 🔌 WebSocket Events

### Client → Server

#### Join Conversation
```javascript
socket.emit('join:conversation', { conversationId: 'conv123' });
```

#### Leave Conversation
```javascript
socket.emit('leave:conversation', { conversationId: 'conv123' });
```

#### Send Message
```javascript
socket.emit('message:send', { 
  conversationId: 'conv123', 
  content: 'Hello!' 
});
```

#### Mark Message as Read
```javascript
socket.emit('message:read', { messageId: 'msg123' });
```

#### Start Typing
```javascript
socket.emit('typing:start', { conversationId: 'conv123' });
```

#### Stop Typing
```javascript
socket.emit('typing:stop', { conversationId: 'conv123' });
```

#### Initiate Call
```javascript
socket.emit('call:initiate', { conversationId: 'conv123' });
```

### Server → Client

#### New Message
```javascript
socket.on('message:new', (message) => {
  console.log('New message:', message);
});
```

#### Message Read
```javascript
socket.on('message:read', (data) => {
  console.log('Message read:', data);
});
```

#### Typing Status
```javascript
socket.on('typing:status', (data) => {
  console.log('Typing:', data);
});
```

#### Call Request
```javascript
socket.on('call:request', (data) => {
  console.log('Incoming call:', data);
});
```

---

## 🏥 Health Check

### Health Endpoint
```
GET /health
Response: { "status": "ok", "service": "chat-service", "timestamp": "..." }
```

---

## 📝 Testing Examples

### cURL Examples

#### Create Live Chat
```bash
curl -X POST http://localhost:3006/api/chat/live/conversations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Technical Support"}'
```

#### Send Message
```bash
curl -X POST http://localhost:3006/api/chat/conversations/CONV_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, I need help!"}'
```

#### Get Messages
```bash
curl -X GET "http://localhost:3006/api/chat/conversations/CONV_ID/messages?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 Business Rules

### Order Chat
- ✅ Only available when order status is "Pending" or "Working"
- ✅ Messages auto-deleted after 7 days
- ✅ File/voice upload only after admin replies
- ✅ Call only after admin replies

### Agency Chat
- ✅ Only available when agency status is "Active"
- ✅ Messages auto-deleted after 7 days
- ✅ File/voice upload only after admin replies
- ✅ Call only after admin replies

### Live Chat
- ✅ Message history deleted after 15 minutes offline
- ✅ File/voice upload only after admin replies
- ✅ Call only after admin replies

---

## 📊 Response Formats

### Success Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

