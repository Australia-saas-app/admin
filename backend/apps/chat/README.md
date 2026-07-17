# Chat Service

Real-time messaging service with Socket.io for Live Chat, Order Chat, and Agency Chat.

## Features

- **Live Chat**: General support chat with topic selection
- **Order Chat**: Order-specific chat (only when order status is Pending/Working)
- **Agency Chat**: Agency-specific chat (only when agency status is Active)
- **Real-time Messaging**: Socket.io WebSocket support
- **File & Voice Uploads**: With business rule validation
- **Admin Assignment**: Auto and manual assignment
- **Message Expiration**: Auto-cleanup based on rules
- **Predefined Messages**: Admin message templates

## Setup

1. Copy environment template:
```bash
cp env.template .env
```

2. Update `.env` with your configuration

3. Install dependencies:
```bash
npm install
```

4. Start service:
```bash
npm run start:dev
```

## API Documentation

Once running, visit: `http://localhost:3006/api/chat/docs`

## WebSocket

Connect to: `ws://localhost:3006/chat`

## Environment Variables

See `env.template` for all required environment variables.

## Testing

```bash
npm test
```

