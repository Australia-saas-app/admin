/**
 * Chat-specific hooks using the centralized socket center
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { socketCenter, ChatEventHandlers } from "./socketCenter";
import { TMessage } from "@/src/shared/chat/ui/types";
// import { TMessage } from "./type";
// import { TMessage } from "@/business/live-chat/types";

export interface UseChatOptions {
  userId: string;
  autoConnect?: boolean;
  onMessage?: (message: TMessage) => void;
  onTyping?: (data: { userId: string; isTyping: boolean }) => void;
  onPresence?: (users: string[]) => void;
}

export interface UseChatReturn {
  isConnected: boolean;
  sendMessage: (message: TMessage) => void;
  emitTyping: (isTyping: boolean) => void;
  reconnect: () => void;
  disconnect: () => void;
}

/**
 * Hook for managing chat functionality with centralized socket
 */
export const useChat = (options: UseChatOptions): UseChatReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef<ChatEventHandlers>({});

  // Update handlers ref when options change
  useEffect(() => {
    handlersRef.current = {
      onMessage: options.onMessage,
      onTyping: options.onTyping,
      onPresence: options.onPresence,
    };
  }, [options.onMessage, options.onTyping, options.onPresence]);

  // Initialize socket center
  useEffect(() => {
    if (!options.userId) return;

    const notificationHandlers = {
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      onConnectError: () => setIsConnected(false),
    };

    socketCenter.initialize({
      userId: options.userId,
      chatHandlers: handlersRef.current,
      notificationHandlers,
      autoConnect: options.autoConnect,
    });

    // Update connection status
    setIsConnected(socketCenter.getConnectionStatus());

    return () => {
      // Don't disconnect here as other components might be using the socket
      // The socket center manages its own lifecycle
    };
  }, [options.userId, options.autoConnect]);

  // Update handlers when they change
  useEffect(() => {
    socketCenter.updateHandlers(handlersRef.current);
  }, [options.onMessage, options.onTyping, options.onPresence]);

  const sendMessage = useCallback((message: TMessage) => {
    socketCenter.sendMessage(message);
  }, []);

  const emitTyping = useCallback((isTyping: boolean) => {
    socketCenter.emitTyping(isTyping);
  }, []);

  const reconnect = useCallback(() => {
    socketCenter.reconnect();
  }, []);

  const disconnect = useCallback(() => {
    socketCenter.disconnect();
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    sendMessage,
    emitTyping,
    reconnect,
    disconnect,
  };
};

export interface UsePrivateChatOptions {
  userId: string;
  conversationId?: string;
  onNewMessage?: (message: TMessage) => void;
}

export interface UsePrivateChatReturn extends UseChatReturn {
  messages: TMessage[];
  addMessage: (message: TMessage) => void;
  clearMessages: () => void;
  setMessages: (messages: TMessage[]) => void;
}

/**
 * Hook for managing private chat with message state
 */
export const usePrivateChat = (options: UsePrivateChatOptions): UsePrivateChatReturn => {
  const [messages, setMessages] = useState<TMessage[]>([]);

  const handleMessage = useCallback((message: TMessage) => {
    // Filter messages for this conversation if conversationId is provided
    if (options.conversationId && message.conversationId !== options.conversationId) {
      return;
    }
    
    setMessages(prev => [...prev, { ...message, createdAt: new Date() }]);
    options.onNewMessage?.(message);
  }, [options]);

  const chatHook = useChat({
    userId: options.userId,
    onMessage: handleMessage,
  });

  const addMessage = useCallback((message: TMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setMessagesCallback = useCallback((newMessages: TMessage[]) => {
    setMessages(newMessages);
  }, []);

  return {
    ...chatHook,
    messages,
    addMessage,
    clearMessages,
    setMessages: setMessagesCallback,
  };
};

export interface UseOrderChatOptions {
  userId: string;
  orderId?: string;
  serviceType?: string;
  onNewMessage?: (message: TMessage) => void;
}

export interface UseOrderChatReturn extends UseChatReturn {
  messages: TMessage[];
  addMessage: (message: TMessage) => void;
  clearMessages: () => void;
  setMessages: (messages: TMessage[]) => void;
  sendOrderMessage: (content: string, receiverId: string, conversationId: string) => void;
}

/**
 * Hook for managing order-specific chat
 */
export const useOrderChat = (options: UseOrderChatOptions): UseOrderChatReturn => {
  const [messages, setMessages] = useState<TMessage[]>([]);

  const handleMessage = useCallback((message: TMessage) => {
    // Filter messages for this order if orderId is provided
    if (options.orderId && message.orderId !== options.orderId) {
      return;
    }
    
    setMessages(prev => [...prev, { ...message, createdAt: new Date(), updatedAt: new Date() }]);
    options.onNewMessage?.(message);
  }, [options]);

  const chatHook = useChat({
    userId: options.userId,
    onMessage: handleMessage,
  });

  const addMessage = useCallback((message: TMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setMessagesCallback = useCallback((newMessages: TMessage[]) => {
    setMessages(newMessages);
  }, []);

  const sendOrderMessage = useCallback((content: string, receiverId: string, conversationId: string) => {
    if (!options.orderId || !options.serviceType) {
      console.error("❌ Cannot send order message: orderId and serviceType are required");
      return;
    }

    const message: TMessage = {
      senderId: options.orderId,
      senderName: "Admin", // This should come from auth context
      receiverId,
      content,
      createdAt: new Date(),
      conversationId,
      serviceType: options.serviceType,
      type: "order",
      orderId: options.orderId,
      authority: "admin",
    };

    socketCenter.sendMessage(message);
    addMessage(message);
  }, [options.orderId, options.serviceType, addMessage]);

  return {
    ...chatHook,
    messages,
    addMessage,
    clearMessages,
    setMessages: setMessagesCallback,
    sendOrderMessage,
  };
};

/**
 * Hook for managing typing indicators
 */
export const useTypingIndicator = (userId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = useCallback((data: { userId: string; isTyping: boolean }) => {
    if (data.userId === userId) return; // Don't show own typing

    setTypingUsers(prev => {
      if (data.isTyping) {
        return prev.includes(data.userId) ? prev : [...prev, data.userId];
      } else {
        return prev.filter(id => id !== data.userId);
      }
    });
  }, [userId]);

  useChat({
    userId,
    onTyping: handleTyping,
  });

  const startTyping = useCallback(() => {
    socketCenter.emitTyping(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketCenter.emitTyping(false);
    }, 0);
  }, []);

  const stopTyping = useCallback(() => {
    socketCenter.emitTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
};
