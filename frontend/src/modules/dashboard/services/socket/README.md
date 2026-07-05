# Socket Center System

## Overview

The Socket Center System is a centralized WebSocket management solution for the Agency Service Admin application. It provides a unified interface for handling real-time chat and notifications across the entire application.

## 🚀 Quick Start

### 1. Wrap your app with the UnifiedSocketProvider

```tsx
// App.tsx
import { UnifiedSocketProvider } from '@/services/socket';

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return (
    <UnifiedSocketProvider userId={user?.id || "admin"}>
      <YourAppComponents />
    </UnifiedSocketProvider>
  );
}
```

### 2. Use specialized hooks in your components

#### For Live Chat

```tsx
import { usePrivateChat } from '@/services/socket';

const LiveChatComponent = () => {
  const {
    isConnected,
    messages,
    sendMessage,
    addMessage,
    setMessages,
  } = usePrivateChat({
    userId: "admin",
    conversationId: selectedUser?.conversationId,
    onNewMessage: handleNewMessage,
  });
  
  // Your component logic
};
```

#### For Order Chat

```tsx
import { useOrderChat } from '@/services/socket';

const OrderChatComponent = () => {
  const {
    isConnected,
    messages,
    sendOrderMessage,
    setMessages,
  } = useOrderChat({
    userId: orderId,
    orderId: orderId,
    serviceType: serviceType,
    onNewMessage: handleNewMessage,
  });
  
  // Your component logic
};
```

#### For Notifications

```tsx
import { useUnifiedNotifications } from '@/services/socket';

const NotificationComponent = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useUnifiedNotifications();
  
  // Your component logic
};
```

## 📚 Documentation

This folder contains comprehensive documentation for the Socket Center System:

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**: Step-by-step instructions for migrating from the old socket implementation to the new centralized system.

- **[SOCKET_CENTER_DOCS.md](./SOCKET_CENTER_DOCS.md)**: Comprehensive API documentation, architecture overview, usage examples, best practices, error handling, performance considerations, and troubleshooting guide.

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**: Summary of the implementation, including architecture, key features, migration benefits, and next steps.

## 📁 File Structure

```
./
├── config.ts                     # Socket configuration and constants
├── socketService.ts              # Low-level socket operations
├── notificationApi.ts            # API integration for notifications
├── notificationManager.ts        # Notification state management
├── hooks.ts                      # Legacy notification hooks
├── type.d.ts                     # TypeScript type definitions
├── SocketContext.tsx             # Legacy context provider
├── socketCenter.ts               # Central socket management hub
├── chatHooks.ts                  # Specialized chat hooks
├── UnifiedSocketContext.tsx      # Unified context provider
├── index.ts                      # Module exports
├── README.md                     # This file
├── MIGRATION_GUIDE.md            # Migration instructions
├── SOCKET_CENTER_DOCS.md         # Comprehensive documentation
├── IMPLEMENTATION_SUMMARY.md     # Implementation summary
├── __tests__/
│   └── socket.test.tsx           # Test suite
└── examples/
    ├── RefactoredMainChatArea.tsx # Example refactored component
    └── RefactoredOrderChatManage.tsx # Example refactored component
```

## Key Features

- **Separation of Concerns**: Each module has a single responsibility
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Real-time Updates**: Socket.IO integration for live notifications
- **State Management**: Centralized notification state with proper updates
- **API Integration**: RESTful API calls for persistence
- **Custom Hooks**: Specialized hooks for different notification types
- **Error Handling**: Robust error handling throughout the system
- **Performance**: Optimized with React.useCallback and proper memoization

## Quick Start

### 1. Setup the Provider

```tsx
import { SocketContextProvider } from './context/socket';

function App() {
  return (
    <SocketContextProvider userId="admin">
      <YourApp />
    </SocketContextProvider>
  );
}
```

### 2. Use Notifications in Components

```tsx
import { useNotifications, useOrderNotifications } from './context/socket';

function NotificationComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { notifications: orderNotifications } = useOrderNotifications();

  return (
    <div>
      <h3>All Notifications ({unreadCount})</h3>
      {notifications.map(notification => (
        <div key={notification.id} onClick={() => markAsRead(notification.id)}>
          {notification.title}
        </div>
      ))}
    </div>
  );
}
```

## Available Hooks

### Core Hooks

- `useSocket()` - Access full socket context
- `useNotifications()` - Access all notifications and methods
- `useSocketConnection()` - Connection status only

### Filtered Hooks

- `useOrderNotifications()` - Order-specific notifications
- `useMessageNotifications()` - Message-specific notifications
- `useSystemNotifications()` - System notifications
- `useHighPriorityNotifications()` - High priority notifications only
- `useUnreadNotifications()` - Unread notifications only

## API Methods

All hooks provide these methods:

```tsx
const {
  notifications,           // TNotification[]
  unreadCount,            // number
  isConnected,            // boolean
  markAsRead,             // (id: string) => Promise<void>
  markAllAsRead,          // () => Promise<void>
  clearNotifications,     // () => void
  addNotification,        // (notification: TNotification) => void
} = useNotifications();
```

## Configuration

Customize the system through `config.ts`:

```typescript
export const SOCKET_CONFIG = {
  URL: process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8000",
  OPTIONS: {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
  LIMITS: {
    MAX_NOTIFICATIONS: 1000,
    DISPLAY_LIMIT: 50,
  },
};
```

## Type Definitions

### TNotification

```typescript
interface TNotification {
  id: string;
  type: "order" | "message" | "system";
  title: string;
  content: string;
  orderId?: string;
  userId: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  read: boolean;
  data?: Record<string, any>;
}
```

## Advanced Usage

### Direct Service Access

For advanced use cases, you can access services directly:

```typescript
import { socketService, notificationApi, NotificationManager } from './context/socket';

// Direct socket operations
socketService.emit('custom-event', data);

// Direct API calls
const notifications = await notificationApi.fetchNotifications({ type: 'order' });

// Direct state management
const manager = new NotificationManager();
manager.addNotification(notification);
```

### Custom Event Handling

```typescript
import { socketService } from './context/socket';

// Listen to custom events
const socket = socketService.getSocket();
if (socket) {
  socket.on('custom-event', (data) => {
    console.log('Custom event received:', data);
  });
}
```

## Error Handling

The system includes comprehensive error handling:

- Network failures are logged and handled gracefully
- Socket disconnections trigger automatic reconnection
- API failures don't crash the application
- Invalid data is filtered out

## Performance Considerations

- Notifications are limited to prevent memory issues
- State updates are batched and optimized
- Socket events use proper cleanup
- React hooks are memoized with useCallback

## Migration Guide

If migrating from the old system:

1. Replace direct context imports with hook imports
2. Update component imports to use the new hook structure
3. Remove any direct socket.io usage in favor of the service layer
4. Update type imports to use the new type definitions

### Before
```tsx
import { useNotifications } from './SocketContext';
```

### After
```tsx
import { useNotifications } from './context/socket';
```

## Testing

The modular structure makes testing easier:

```typescript
// Test notification manager
const manager = new NotificationManager();
manager.addNotification(mockNotification);
expect(manager.getState().notifications).toHaveLength(1);

// Test API service
const api = new NotificationApiService('http://test-url');
// Mock fetch and test API calls
```

## Contributing

When adding new features:

1. Add types to `type.d.ts`
2. Update configuration in `config.ts` if needed
3. Add new hooks to `hooks.ts`
4. Update exports in `index.ts`
5. Document changes in this README

## Troubleshooting

### Common Issues

1. **Socket not connecting**: Check SOCKET_URL configuration
2. **Notifications not updating**: Ensure component is wrapped in SocketContextProvider
3. **Type errors**: Make sure all imports use the correct type definitions
4. **Performance issues**: Check if notifications are being properly limited

### Debug Mode

Enable debug logging by setting:
```typescript
process.env.NODE_ENV = 'development';
```

This will show detailed socket connection logs in the console.