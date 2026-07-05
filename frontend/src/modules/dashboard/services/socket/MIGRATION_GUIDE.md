# Socket System Migration Guide

## Overview

This guide helps you migrate from the old individual socket implementations to the new centralized socket management system. The new system provides better performance, consistency, and maintainability.

## Key Benefits of the New System

### 🎯 **Centralized Management**
- Single socket connection per user across the entire application
- Consistent connection state management
- Reduced resource usage and connection overhead

### 🔧 **Better Developer Experience**
- Specialized hooks for different use cases
- Type-safe interfaces
- Automatic reconnection handling
- Built-in error handling

### 🚀 **Performance Improvements**
- Connection pooling and reuse
- Optimized event handling
- Memory leak prevention
- Automatic cleanup

### 🛡️ **Enhanced Reliability**
- Robust reconnection logic
- Connection status monitoring
- Error recovery mechanisms
- Event handler management

## Migration Strategies

### Strategy 1: Unified Provider (Recommended)

Replace your existing socket implementations with the unified provider that handles both chat and notifications.

#### Before (Old Implementation)
```tsx
// Multiple socket connections in different components
const MainChatArea = () => {
  const socket = useRef<Socket | null>(null);
  
  useEffect(() => {
    socket.current = io(SOCKET_URL);
    socket.current.emit("register", userId);
    socket.current.on("private_message", handleMessage);
    
    return () => {
      socket.current?.disconnect();
    };
  }, [userId]);
  
  // ... rest of component
};
```

#### After (New Implementation)
```tsx
// App.tsx - Wrap your app with the unified provider
import { UnifiedSocketProvider } from '@/services/socket';

function App() {
  return (
    <UnifiedSocketProvider userId="admin">
      <YourAppComponents />
    </UnifiedSocketProvider>
  );
}

// MainChatArea.tsx - Use specialized hooks
import { usePrivateChat } from '@/services/socket';

const MainChatArea = () => {
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
      console.log("New message:", message);
    },
  });
  
  // ... rest of component
};
```

### Strategy 2: Specialized Hooks

Use specific hooks for different chat types while maintaining the centralized connection.

#### For Live Chat
```tsx
import { usePrivateChat } from '@/services/socket';

const LiveChatComponent = () => {
  const {
    isConnected,
    messages,
    sendMessage,
    setMessages,
  } = usePrivateChat({
    userId: currentUserId,
    conversationId: conversationId,
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

### Strategy 3: Direct Socket Center Usage

For advanced use cases, directly use the socket center.

```tsx
import { socketCenter } from '@/services/socket';

const AdvancedComponent = () => {
  useEffect(() => {
    socketCenter.initialize({
      userId: "admin",
      chatHandlers: {
        onMessage: handleMessage,
        onTyping: handleTyping,
      },
      notificationHandlers: {
        onNotification: handleNotification,
      },
    });
    
    return () => {
      // Socket center manages its own cleanup
    };
  }, []);
  
  const sendCustomMessage = () => {
    socketCenter.emit('custom_event', data);
  };
};
```

## Step-by-Step Migration

### Step 1: Install the New System

The new system is already available in your `@/services/socket` module. No additional installation required.

### Step 2: Update Your App Provider

```tsx
// App.tsx or your root component
import { UnifiedSocketProvider } from '@/services/socket';
import { useSelector } from 'react-redux';

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return (
    <UnifiedSocketProvider 
      userId={user?.id || "admin"}
      onMessage={(message) => {
        // Global message handler (optional)
        console.log('Global message received:', message);
      }}
    >
      <YourAppComponents />
    </UnifiedSocketProvider>
  );
}
```

### Step 3: Migrate Individual Components

#### For MainChatArea.tsx

1. Remove the old socket setup:
```tsx
// Remove these lines
const socket = useRef<Socket | null>(null);

useEffect(() => {
  socket.current = io(SOCKET_URL);
  socket.current.emit("register", userId);
  socket.current.on("private_message", handleMessage);
  
  return () => {
    socket.current?.disconnect();
  };
}, [userId]);
```

2. Replace with the new hook:
```tsx
import { usePrivateChat } from '@/services/socket';

const {
  isConnected,
  messages,
  sendMessage: sendSocketMessage,
  addMessage,
  setMessages,
} = usePrivateChat({
  userId: userId || "admin",
  conversationId: selectedUser?.conversationId,
  onNewMessage: (message) => {
    // Handle new messages
    setTimeout(() => scrollToBottom(), 100);
  },
});
```

3. Update your send message function:
```tsx
const sendMessage = (e: React.FormEvent) => {
  if (e) e.preventDefault();
  if (!input.trim() || !selectedUser) return;

  const msg: TMessage = {
    senderId: selectedUser.receiverId!,
    receiverId: selectedUser.senderId!,
    content: input,
    createdAt: new Date(),
    senderName: authStore?.name || "",
    conversationId: selectedUser.conversationId!,
    serviceType: selectedUser.serviceType!,
    type: "live",
    authority: "admin",
  };

  // Use the new centralized system
  sendSocketMessage(msg);
  addMessage(msg); // Optimistic UI update
  setInput("");
};
```

#### For OrderChatManage.tsx

1. Remove the old socket setup:
```tsx
// Remove these lines
const socket = useRef<Socket | null>(null);

useEffect(() => {
  socket.current = io(SOCKET_URL);
  socket.current.emit("register", orderId);
  socket.current.on("private_message", handleMessage);
  
  return () => {
    socket.current?.disconnect();
  };
}, [orderId]);
```

2. Replace with the new hook:
```tsx
import { useOrderChat } from '@/services/socket';

const {
  isConnected,
  messages,
  setMessages,
  sendOrderMessage,
} = useOrderChat({
  userId: selectedOrder?.orderId || "",
  orderId: selectedOrder?.orderId,
  serviceType: selectedOrder?.serviceType,
  onNewMessage: (message) => {
    setTimeout(() => scrollToBottom(), 100);
  },
});
```

3. Update your send message function:
```tsx
const sendMyMessage = async () => {
  if (!message?.trim() || !selectedOrder?.orderId || !conversation?.orderId)
    return;

  try {
    // Use the centralized system
    sendOrderMessage(
      message,
      conversation?.senderId || "",
      conversation?.conversationId || ""
    );
    setMessage("");
  } catch (err) {
    console.error(err);
  }
};
```

### Step 4: Update Connection Status Indicators

Add connection status indicators to your UI:

```tsx
// In your chat header
<p className="text-sm flex items-center">
  <Circle 
    className={`w-2 h-2 fill-current mr-1 ${
      isConnected ? 'text-green-600' : 'text-red-600'
    }`} 
  />
  {isConnected ? 'Online' : 'Offline'}
</p>

// In your message input
<input
  // ... other props
  disabled={!isConnected}
  placeholder={isConnected ? "Type your message..." : "Connecting..."}
/>

// Connection status message
{!isConnected && (
  <p className="text-sm text-red-500 mt-2">
    Connection lost. Trying to reconnect...
  </p>
)}
```

### Step 5: Test and Validate

1. **Test Connection Management**
   - Verify single connection across components
   - Test reconnection on network issues
   - Check connection status updates

2. **Test Message Flow**
   - Send messages from different components
   - Verify message delivery and receipt
   - Test message filtering by conversation/order

3. **Test Notifications**
   - Verify notification delivery
   - Test unread count updates
   - Check mark as read functionality

## Common Migration Issues

### Issue 1: Multiple Connections

**Problem**: Multiple socket connections being created.

**Solution**: Ensure you're using the UnifiedSocketProvider at the app level and not creating additional socket instances.

### Issue 2: Message Duplication

**Problem**: Messages appearing multiple times.

**Solution**: Remove old socket event listeners and use only the new hooks.

### Issue 3: Connection State Inconsistency

**Problem**: Connection status not updating correctly.

**Solution**: Use the `isConnected` state from the hooks instead of managing your own connection state.

### Issue 4: Event Handler Conflicts

**Problem**: Old and new event handlers conflicting.

**Solution**: Completely remove old socket setup code before implementing new hooks.

## Performance Considerations

### Memory Management
- The new system automatically handles cleanup
- No need to manually disconnect sockets in components
- Event handlers are properly managed and cleaned up

### Connection Efficiency
- Single connection per user reduces server load
- Automatic reconnection with exponential backoff
- Connection pooling and reuse

### Event Handling
- Optimized event routing
- Reduced event listener overhead
- Better error handling and recovery

## Backward Compatibility

The old notification system (`SocketContext`, `SocketContextProvider`) remains available for backward compatibility. However, we recommend migrating to the new unified system for better performance and features.

## Support and Troubleshooting

If you encounter issues during migration:

1. Check the console for connection errors
2. Verify userId is properly set
3. Ensure proper cleanup of old socket code
4. Test with network throttling to verify reconnection
5. Use the browser's Network tab to monitor socket connections

## Examples

See the `examples/` folder for complete refactored components:
- `RefactoredMainChatArea.tsx`
- `RefactoredOrderChatManage.tsx`

These examples show the complete migration from old to new implementation.