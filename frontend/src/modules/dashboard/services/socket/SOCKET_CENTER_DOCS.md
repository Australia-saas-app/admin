# Socket Center Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [API Reference](#api-reference)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Error Handling](#error-handling)
8. [Performance](#performance)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

## Overview

The Socket Center is a centralized socket management system that provides a unified interface for handling WebSocket connections, chat functionality, and real-time notifications in the Agency Service Admin application.

### Key Features

- **🎯 Centralized Connection Management**: Single socket connection per user
- **🔄 Automatic Reconnection**: Robust reconnection logic with exponential backoff
- **📨 Multi-Chat Support**: Handle live chat, order chat, and notifications
- **🎣 React Hooks Integration**: Specialized hooks for different use cases
- **🛡️ Type Safety**: Full TypeScript support with comprehensive type definitions
- **⚡ Performance Optimized**: Connection pooling, event optimization, memory leak prevention
- **🔧 Developer Friendly**: Easy-to-use APIs with comprehensive error handling

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Components using hooks:                                    │
│  • usePrivateChat()                                         │
│  • useOrderChat()                                           │
│  • useUnifiedNotifications()                                │
│  • useUnifiedSocket()                                       │
├─────────────────────────────────────────────────────────────┤
│                    Hook Layer                               │
├─────────────────────────────────────────────────────────────┤
│  • chatHooks.ts - Chat-specific hooks                       │
│  • UnifiedSocketContext.tsx - Context provider              │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│  • SocketCenter - Central socket management                 │
│  • NotificationManager - Notification state management      │
│  • NotificationApi - API integration                        │
├─────────────────────────────────────────────────────────────┤
│                    Core Layer                               │
├─────────────────────────────────────────────────────────────┤
│  • SocketService - Low-level socket operations              │
│  • Config - Socket configuration and constants              │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. SocketCenter

The central hub for all socket operations.

```typescript
class SocketCenter {
  // Connection management
  initialize(config: SocketCenterConfig): Promise<void>
  disconnect(): void
  reconnect(): Promise<void>
  
  // Event handling
  emit(event: string, data: any): void
  on(event: string, handler: Function): void
  off(event: string, handler: Function): void
  
  // Chat operations
  sendPrivateMessage(message: TMessage): void
  sendOrderMessage(content: string, receiverId: string, conversationId: string): void
  
  // Status
  isConnected(): boolean
  getConnectionStatus(): ConnectionStatus
}
```

### 2. UnifiedSocketProvider

React context provider that wraps the entire application.

```typescript
interface UnifiedSocketProviderProps {
  userId: string;
  children: React.ReactNode;
  onMessage?: (message: TMessage) => void;
  onNotification?: (notification: TNotification) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}
```

### 3. Specialized Hooks

#### usePrivateChat

For live chat functionality.

```typescript
interface UsePrivateChatConfig {
  userId: string;
  conversationId?: string;
  onNewMessage?: (message: TMessage) => void;
  autoConnect?: boolean;
}

interface UsePrivateChatReturn {
  isConnected: boolean;
  messages: TMessage[];
  sendMessage: (message: TMessage) => void;
  addMessage: (message: TMessage) => void;
  setMessages: (messages: TMessage[]) => void;
  clearMessages: () => void;
}
```

#### useOrderChat

For order-specific chat functionality.

```typescript
interface UseOrderChatConfig {
  userId: string;
  orderId?: string;
  serviceType?: string;
  onNewMessage?: (message: TMessage) => void;
  autoConnect?: boolean;
}

interface UseOrderChatReturn {
  isConnected: boolean;
  messages: TMessage[];
  sendOrderMessage: (content: string, receiverId: string, conversationId: string) => void;
  addMessage: (message: TMessage) => void;
  setMessages: (messages: TMessage[]) => void;
  clearMessages: () => void;
}
```

#### useUnifiedNotifications

For notification management.

```typescript
interface UseUnifiedNotificationsReturn {
  notifications: TNotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
  addNotification: (notification: TNotification) => void;
}
```

## API Reference

### Socket Events

#### Outgoing Events

| Event | Description | Payload |
|-------|-------------|----------|
| `register` | Register user with socket server | `{ userId: string }` |
| `private_message` | Send private message | `TMessage` |
| `order_message` | Send order-related message | `TMessage` |
| `typing_start` | Indicate user started typing | `{ conversationId: string, userId: string }` |
| `typing_stop` | Indicate user stopped typing | `{ conversationId: string, userId: string }` |

#### Incoming Events

| Event | Description | Payload |
|-------|-------------|----------|
| `connect` | Socket connected | - |
| `disconnect` | Socket disconnected | `{ reason: string }` |
| `private_message` | Receive private message | `TMessage` |
| `order_message` | Receive order message | `TMessage` |
| `notification` | Receive notification | `TNotification` |
| `typing` | User typing indicator | `{ conversationId: string, userId: string, isTyping: boolean }` |
| `error` | Socket error | `{ message: string, code?: string }` |

### Configuration

```typescript
// Socket configuration
export const SOCKET_CONFIG = {
  URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001',
  OPTIONS: {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
    randomizationFactor: 0.5,
  },
  LIMITS: {
    MAX_MESSAGE_LENGTH: 1000,
    MAX_RECONNECTION_ATTEMPTS: 5,
    RECONNECTION_DELAY: 1000,
  },
};
```

## Usage Examples

### Basic Setup

```tsx
// App.tsx
import { UnifiedSocketProvider } from '@/services/socket';

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return (
    <UnifiedSocketProvider 
      userId={user?.id || "admin"}
      onConnectionChange={(isConnected) => {
        console.log('Connection status:', isConnected);
      }}
    >
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </UnifiedSocketProvider>
  );
}
```

### Live Chat Component

```tsx
// LiveChatComponent.tsx
import { usePrivateChat } from '@/services/socket';

const LiveChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [input, setInput] = useState('');
  
  const {
    isConnected,
    messages,
    sendMessage,
    addMessage,
    setMessages,
  } = usePrivateChat({
    userId: "admin",
    conversationId: selectedUser?.conversationId,
    onNewMessage: (message) => {
      // Handle new message (e.g., play sound, show notification)
      console.log('New message received:', message);
    },
  });
  
  // Fetch existing messages when conversation changes
  useEffect(() => {
    if (selectedUser?.conversationId) {
      fetchMessages(selectedUser.conversationId)
        .then(setMessages)
        .catch(console.error);
    }
  }, [selectedUser?.conversationId, setMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    
    const message: TMessage = {
      senderId: "admin",
      receiverId: selectedUser.id,
      content: input,
      createdAt: new Date(),
      conversationId: selectedUser.conversationId,
      serviceType: selectedUser.serviceType,
      type: "live",
      authority: "admin",
    };
    
    sendMessage(message);
    addMessage(message); // Optimistic UI update
    setInput('');
  };
  
  return (
    <div className="chat-container">
      {/* Connection status */}
      <div className="connection-status">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
        {isConnected ? 'Connected' : 'Connecting...'}
      </div>
      
      {/* Messages */}
      <div className="messages">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!isConnected || !selectedUser}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
        />
        <button type="submit" disabled={!isConnected || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};
```

### Order Chat Component

```tsx
// OrderChatComponent.tsx
import { useOrderChat } from '@/services/socket';

const OrderChatComponent = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState('');
  
  const {
    isConnected,
    messages,
    sendOrderMessage,
    setMessages,
  } = useOrderChat({
    userId: selectedOrder?.orderId || "",
    orderId: selectedOrder?.orderId,
    serviceType: selectedOrder?.serviceType,
    onNewMessage: (message) => {
      console.log('New order message:', message);
    },
  });
  
  // Fetch existing messages when order changes
  useEffect(() => {
    if (selectedOrder?.orderId) {
      fetchOrderMessages(selectedOrder.orderId)
        .then(setMessages)
        .catch(console.error);
    }
  }, [selectedOrder?.orderId, setMessages]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedOrder) return;
    
    try {
      await sendOrderMessage(
        message,
        selectedOrder.customerId,
        selectedOrder.conversationId
      );
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  return (
    <div className="order-chat">
      {/* Order info */}
      <div className="order-header">
        <h3>Order #{selectedOrder?.orderId}</h3>
        <span className={`status ${isConnected ? 'online' : 'offline'}`}>
          {isConnected ? 'Online' : 'Offline'}
        </span>
      </div>
      
      {/* Messages */}
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.authority}`}>
            <div className="content">{msg.content}</div>
            <div className="timestamp">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div className="message-input">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isConnected}
          placeholder="Type your message..."
        />
        <button 
          onClick={handleSendMessage}
          disabled={!isConnected || !message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};
```

### Notification Component

```tsx
// NotificationComponent.tsx
import { useUnifiedNotifications } from '@/services/socket';

const NotificationComponent = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useUnifiedNotifications();
  
  const handleNotificationClick = async (notification: TNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    // Handle notification action (e.g., navigate to relevant page)
    if (notification.type === 'order') {
      navigate(`/orders/${notification.orderId}`);
    } else if (notification.type === 'message') {
      navigate(`/chat/${notification.conversationId}`);
    }
  };
  
  return (
    <div className="notifications">
      <div className="notification-header">
        <h3>Notifications ({unreadCount})</h3>
        <button onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark All Read
        </button>
        <button onClick={clearNotifications}>
          Clear All
        </button>
      </div>
      
      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.isRead ? 'read' : 'unread'}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <span className="timestamp">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
            {!notification.isRead && (
              <div className="unread-indicator" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Best Practices

### 1. Connection Management

```tsx
// ✅ Good: Use the unified provider at app level
<UnifiedSocketProvider userId={userId}>
  <App />
</UnifiedSocketProvider>

// ❌ Bad: Multiple socket connections
const Component1 = () => {
  const socket = io(SOCKET_URL); // Don't do this
};

const Component2 = () => {
  const socket = io(SOCKET_URL); // Don't do this
};
```

### 2. Message Handling

```tsx
// ✅ Good: Use specialized hooks
const { sendMessage } = usePrivateChat({
  userId: "admin",
  onNewMessage: handleNewMessage,
});

// ❌ Bad: Direct socket usage
const socket = io(SOCKET_URL);
socket.emit('private_message', message);
```

### 3. Error Handling

```tsx
// ✅ Good: Handle errors gracefully
const handleSendMessage = async () => {
  try {
    await sendMessage(message);
  } catch (error) {
    console.error('Failed to send message:', error);
    // Show user-friendly error message
    showErrorToast('Failed to send message. Please try again.');
  }
};

// ❌ Bad: No error handling
const handleSendMessage = () => {
  sendMessage(message); // What if this fails?
};
```

### 4. Performance Optimization

```tsx
// ✅ Good: Memoize callbacks
const handleNewMessage = useCallback((message: TMessage) => {
  // Handle message
}, []);

const { messages } = usePrivateChat({
  userId: "admin",
  onNewMessage: handleNewMessage,
});

// ❌ Bad: New function on every render
const { messages } = usePrivateChat({
  userId: "admin",
  onNewMessage: (message) => {
    // This creates a new function on every render
  },
});
```

## Error Handling

### Connection Errors

```tsx
const ChatComponent = () => {
  const { isConnected } = useUnifiedSocket();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isConnected) {
      const timer = setTimeout(() => {
        setConnectionError('Connection lost. Please check your internet connection.');
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setConnectionError(null);
    }
  }, [isConnected]);
  
  if (connectionError) {
    return (
      <div className="error-state">
        <p>{connectionError}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  // ... rest of component
};
```

### Message Send Errors

```tsx
const handleSendMessage = async () => {
  try {
    await sendMessage(message);
    setMessage('');
  } catch (error) {
    if (error.code === 'RATE_LIMIT') {
      showErrorToast('You are sending messages too quickly. Please wait a moment.');
    } else if (error.code === 'MESSAGE_TOO_LONG') {
      showErrorToast('Message is too long. Please shorten your message.');
    } else {
      showErrorToast('Failed to send message. Please try again.');
    }
  }
};
```

## Performance

### Memory Management

- The system automatically handles cleanup of event listeners
- Messages are automatically garbage collected when components unmount
- Connection pooling reduces memory usage

### Network Optimization

- Single connection per user reduces network overhead
- Automatic reconnection with exponential backoff
- Message queuing during disconnection

### Rendering Optimization

- Use `React.memo` for message components
- Implement virtual scrolling for large message lists
- Debounce typing indicators

```tsx
// Optimized message component
const MessageComponent = React.memo(({ message }: { message: TMessage }) => {
  return (
    <div className="message">
      <div className="content">{message.content}</div>
      <div className="timestamp">
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
});

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const MessageList = ({ messages }: { messages: TMessage[] }) => {
  return (
    <List
      height={400}
      itemCount={messages.length}
      itemSize={60}
      itemData={messages}
    >
      {({ index, style, data }) => (
        <div style={style}>
          <MessageComponent message={data[index]} />
        </div>
      )}
    </List>
  );
};
```

## Testing

### Unit Tests

```tsx
// __tests__/socketCenter.test.ts
import { socketCenter } from '../socketCenter';
import { mockSocket } from '../__mocks__/socket.io-client';

describe('SocketCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should initialize connection', async () => {
    await socketCenter.initialize({ userId: 'test-user' });
    expect(mockSocket.connect).toHaveBeenCalled();
  });
  
  it('should send private message', () => {
    const message = { content: 'test', senderId: 'user1', receiverId: 'user2' };
    socketCenter.sendPrivateMessage(message);
    expect(mockSocket.emit).toHaveBeenCalledWith('private_message', message);
  });
});
```

### Integration Tests

```tsx
// __tests__/chatHooks.test.tsx
import { renderHook, act } from '@testing-library/react';
import { usePrivateChat } from '../chatHooks';
import { UnifiedSocketProvider } from '../UnifiedSocketContext';

const wrapper = ({ children }) => (
  <UnifiedSocketProvider userId="test-user">
    {children}
  </UnifiedSocketProvider>
);

describe('usePrivateChat', () => {
  it('should send message', async () => {
    const { result } = renderHook(
      () => usePrivateChat({ userId: 'test-user' }),
      { wrapper }
    );
    
    const message = { content: 'test message' };
    
    await act(async () => {
      result.current.sendMessage(message);
    });
    
    expect(result.current.messages).toContain(message);
  });
});
```

## Troubleshooting

### Common Issues

#### 1. Connection Not Establishing

**Symptoms**: `isConnected` remains `false`

**Solutions**:
- Check if the socket server is running
- Verify the `SOCKET_URL` in configuration
- Check network connectivity
- Verify firewall settings

#### 2. Messages Not Sending

**Symptoms**: Messages not appearing in chat

**Solutions**:
- Check connection status
- Verify user registration
- Check message format
- Review server logs

#### 3. Multiple Connections

**Symptoms**: Multiple socket connections in network tab

**Solutions**:
- Ensure single `UnifiedSocketProvider` at app level
- Remove old socket initialization code
- Check for duplicate providers

#### 4. Memory Leaks

**Symptoms**: Increasing memory usage over time

**Solutions**:
- Ensure proper cleanup in `useEffect`
- Use the provided hooks instead of direct socket usage
- Check for event listener leaks

### Debug Mode

```tsx
// Enable debug mode
const DebugSocketInfo = () => {
  const { isConnected } = useUnifiedSocket();
  const { messages } = usePrivateChat({ userId: 'admin' });
  
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="debug-info">
        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
        <p>Messages: {messages.length}</p>
        <p>Socket ID: {socketCenter.getSocketId()}</p>
      </div>
    );
  }
  
  return null;
};
```

### Logging

```tsx
// Enable detailed logging
if (process.env.NODE_ENV === 'development') {
  socketCenter.enableDebugMode();
}
```

This will log all socket events, connection status changes, and message flows to the console.