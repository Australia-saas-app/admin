import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

// Types
export type MessageType = "bot" | "user" | "system";

export interface Message {
  id: string;
  type: MessageType;
  message: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  isDelivered?: boolean;
  isRead?: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isOnline: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  agentId?: string;
  status: "active" | "waiting" | "closed" | "transferred";
  createdAt: Date;
  updatedAt: Date;
  category?: string;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface ChatState {
  // Connection
  isConnected: boolean;
  connectionError: string | null;

  // Session
  currentSession: ChatSession | null;

  // User
  currentUser: User | null;

  // Messages
  messages: Message[];

  // UI State
  isTyping: boolean;
  typingUsers: TypingIndicator[];
  unreadCount: number;

  // Agent
  assignedAgent: User | null;
  isAgentOnline: boolean;

  // Queue
  queuePosition: number | null;
  estimatedWaitTime: number | null;
}

// Action Types
export type ChatAction =
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "SET_CONNECTION_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "SET_CURRENT_SESSION"; payload: ChatSession | null }
  | { type: "ADD_MESSAGE"; payload: Message }
  | {
      type: "UPDATE_MESSAGE";
      payload: { id: string; updates: Partial<Message> };
    }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "SET_TYPING_USERS"; payload: TypingIndicator[] }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "SET_ASSIGNED_AGENT"; payload: User | null }
  | { type: "SET_AGENT_ONLINE_STATUS"; payload: boolean }
  | { type: "SET_QUEUE_POSITION"; payload: number | null }
  | { type: "SET_ESTIMATED_WAIT_TIME"; payload: number | null }
  | { type: "CLEAR_CHAT_STATE" };

// Socket Events
export interface ServerToClientEvents {
  message: (message: Message) => void;
  messageDelivered: (messageId: string) => void;
  messageRead: (messageId: string) => void;
  userTyping: (data: TypingIndicator) => void;
  userStoppedTyping: (userId: string) => void;
  agentAssigned: (agent: User) => void;
  agentOnlineStatus: (data: { agentId: string; isOnline: boolean }) => void;
  queueUpdate: (data: { position: number; estimatedWaitTime: number }) => void;
  sessionCreated: (session: ChatSession) => void;
  sessionUpdated: (session: ChatSession) => void;
  error: (error: string) => void;
  disconnect: () => void;
  connect: () => void;
}

export interface ClientToServerEvents {
  joinSession: (data: { sessionId: string; userId: string }) => void;
  sendMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  startTyping: (data: { sessionId: string; userId: string }) => void;
  stopTyping: (data: { sessionId: string; userId: string }) => void;
  markMessageAsRead: (messageId: string) => void;
  requestAgent: (data: { sessionId: string; category?: string }) => void;
  endSession: (sessionId: string) => void;
}

// Initial State
const initialState: ChatState = {
  isConnected: false,
  connectionError: null,
  currentSession: null,
  currentUser: null,
  messages: [],
  isTyping: false,
  typingUsers: [],
  unreadCount: 0,
  assignedAgent: null,
  isAgentOnline: false,
  queuePosition: null,
  estimatedWaitTime: null,
};

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload };

    case "SET_CONNECTION_ERROR":
      return { ...state, connectionError: action.payload };

    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };

    case "SET_CURRENT_SESSION":
      return { ...state, currentSession: action.payload };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
        unreadCount:
          action.payload.type === "bot"
            ? state.unreadCount + 1
            : state.unreadCount,
      };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg
        ),
      };

    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    case "SET_TYPING":
      return { ...state, isTyping: action.payload };

    case "SET_TYPING_USERS":
      return { ...state, typingUsers: action.payload };

    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

    case "SET_ASSIGNED_AGENT":
      return { ...state, assignedAgent: action.payload };

    case "SET_AGENT_ONLINE_STATUS":
      return { ...state, isAgentOnline: action.payload };

    case "SET_QUEUE_POSITION":
      return { ...state, queuePosition: action.payload };

    case "SET_ESTIMATED_WAIT_TIME":
      return { ...state, estimatedWaitTime: action.payload };

    case "CLEAR_CHAT_STATE":
      return { ...initialState };

    default:
      return state;
  }
}

// Context
interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;

  // Actions
  connect: (userId: string) => void;
  disconnect: () => void;
  sendMessage: (message: string, type?: MessageType) => void;
  startTyping: () => void;
  stopTyping: () => void;
  createSession: (category?: string) => void;
  requestAgent: (category?: string) => void;
  endSession: () => void;
  markMessageAsRead: (messageId: string) => void;
  clearUnreadCount: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider Props
interface ChatProviderProps {
  children: ReactNode;
  socketUrl?: string;
  options?: {
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
  };
}

// Provider Component
export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
  options = {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket
  useEffect(() => {
    socketRef.current = io(socketUrl, options);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [socketUrl]);

  // Socket Event Listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Connection events
    socket.on("connect", () => {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: true });
      dispatch({ type: "SET_CONNECTION_ERROR", payload: null });
    });

    socket.on("disconnect", () => {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
    });

    socket.on("error", (error: string) => {
      dispatch({ type: "SET_CONNECTION_ERROR", payload: error });
    });

    // Message events
    socket.on("message", (message: Message) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });
    });

    socket.on("messageDelivered", (messageId: string) => {
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: { id: messageId, updates: { isDelivered: true } },
      });
    });

    socket.on("messageRead", (messageId: string) => {
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: { id: messageId, updates: { isRead: true } },
      });
    });

    // Typing events
    socket.on("userTyping", (data: TypingIndicator) => {
      dispatch({
        type: "SET_TYPING_USERS",
        payload: [
          ...state.typingUsers.filter((u) => u.userId !== data.userId),
          data,
        ],
      });
    });

    socket.on("userStoppedTyping", (userId: string) => {
      dispatch({
        type: "SET_TYPING_USERS",
        payload: state.typingUsers.filter((u) => u.userId !== userId),
      });
    });

    // Agent events
    socket.on("agentAssigned", (agent: User) => {
      dispatch({ type: "SET_ASSIGNED_AGENT", payload: agent });
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          id: `system-${Date.now()}`,
          type: "system",
          message: `Agent ${agent.name} has joined the conversation.`,
          timestamp: new Date(),
        },
      });
    });

    socket.on("agentOnlineStatus", (data) => {
      dispatch({ type: "SET_AGENT_ONLINE_STATUS", payload: data.isOnline });
    });

    // Queue events
    socket.on("queueUpdate", (data) => {
      dispatch({ type: "SET_QUEUE_POSITION", payload: data.position });
      dispatch({
        type: "SET_ESTIMATED_WAIT_TIME",
        payload: data.estimatedWaitTime,
      });
    });

    // Session events
    socket.on("sessionCreated", (session: ChatSession) => {
      dispatch({ type: "SET_CURRENT_SESSION", payload: session });
    });

    socket.on("sessionUpdated", (session: ChatSession) => {
      dispatch({ type: "SET_CURRENT_SESSION", payload: session });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
      socket.off("message");
      socket.off("messageDelivered");
      socket.off("messageRead");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("agentAssigned");
      socket.off("agentOnlineStatus");
      socket.off("queueUpdate");
      socket.off("sessionCreated");
      socket.off("sessionUpdated");
    };
  }, [state.typingUsers]);

  // Actions
  const connect = (userId: string) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.connect();

    // Set current user
    const user: User = {
      id: userId,
      name: `User ${userId}`,
      isOnline: true,
    };
    dispatch({ type: "SET_CURRENT_USER", payload: user });
  };

  const disconnect = () => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.disconnect();
    dispatch({ type: "CLEAR_CHAT_STATE" });
  };

  const sendMessage = (message: string, type: MessageType = "user") => {
    const socket = socketRef.current;
    if (!socket || !state.currentSession || !state.currentUser) return;

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: new Date(),
      userId: state.currentUser.id,
      sessionId: state.currentSession.id,
      isDelivered: false,
      isRead: false,
    };

    // Add message to local state immediately
    dispatch({ type: "ADD_MESSAGE", payload: newMessage });

    // Send to server
    socket.emit("sendMessage", {
      type,
      message,
      userId: state.currentUser.id,
      sessionId: state.currentSession.id,
    });
  };

  const startTyping = () => {
    const socket = socketRef.current;
    if (!socket || !state.currentSession || !state.currentUser) return;

    socket.emit("startTyping", {
      sessionId: state.currentSession.id,
      userId: state.currentUser.id,
    });

    dispatch({ type: "SET_TYPING", payload: true });

    // Auto-stop typing after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    const socket = socketRef.current;
    if (!socket || !state.currentSession || !state.currentUser) return;

    socket.emit("stopTyping", {
      sessionId: state.currentSession.id,
      userId: state.currentUser.id,
    });

    dispatch({ type: "SET_TYPING", payload: false });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const createSession = (category?: string) => {
    const socket = socketRef.current;
    if (!socket || !state.currentUser) return;

    const session: ChatSession = {
      id: `session-${Date.now()}`,
      userId: state.currentUser.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      category,
    };

    dispatch({ type: "SET_CURRENT_SESSION", payload: session });

    socket.emit("joinSession", {
      sessionId: session.id,
      userId: state.currentUser.id,
    });
  };

  const requestAgent = (category?: string) => {
    const socket = socketRef.current;
    if (!socket || !state.currentSession) return;

    socket.emit("requestAgent", {
      sessionId: state.currentSession.id,
      category,
    });

    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        id: `system-${Date.now()}`,
        type: "system",
        message: "Connecting you with an agent. Please wait...",
        timestamp: new Date(),
      },
    });
  };

  const endSession = () => {
    const socket = socketRef.current;
    if (!socket || !state.currentSession) return;

    socket.emit("endSession", state.currentSession.id);
    dispatch({ type: "SET_CURRENT_SESSION", payload: null });
  };

  const markMessageAsRead = (messageId: string) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("markMessageAsRead", messageId);
    dispatch({
      type: "UPDATE_MESSAGE",
      payload: { id: messageId, updates: { isRead: true } },
    });
  };

  const clearUnreadCount = () => {
    dispatch({ type: "SET_UNREAD_COUNT", payload: 0 });
  };

  const contextValue: ChatContextType = {
    state,
    dispatch,
    socket: socketRef.current,
    connect,
    disconnect,
    sendMessage,
    startTyping,
    stopTyping,
    createSession,
    requestAgent,
    endSession,
    markMessageAsRead,
    clearUnreadCount,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Custom Hook
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Higher-Order Component for connecting components
export const withChat = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const chat = useChat();
    return <Component {...props} chat={chat} />;
  };
};
