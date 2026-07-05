/**
 * Socket module exports - Centralized socket management system
 */

// NEW: Unified socket system (Recommended)
export {
  UnifiedSocketProvider,
  useUnifiedSocket,
  useUnifiedChat,
  useUnifiedNotifications,
} from './UnifiedSocketContext';

// NEW: Centralized socket center
export { socketCenter, SocketCenter } from './socketCenter';
export type {
  ChatEventHandlers,
  NotificationEventHandlers,
  SocketCenterConfig,
} from './socketCenter';

// NEW: Chat-specific hooks
export {
  useChat,
  usePrivateChat,
  useOrderChat,
  useTypingIndicator,
} from './chatHooks';
export type {
  UseChatOptions,
  UseChatReturn,
  UsePrivateChatOptions,
  UsePrivateChatReturn,
  UseOrderChatOptions,
  UseOrderChatReturn,
} from './chatHooks';

// Legacy exports (for backward compatibility)
export { SocketContext, SocketContextProvider } from './SocketContext';
export {
  useSocket,
  useNotifications,
  useOrderNotifications,
} from './hooks';
export { socketService } from './socketService';
export { notificationApi } from './notificationApi';
export { NotificationManager } from './notificationManager';
export { SOCKET_CONFIG, SOCKET_EVENTS, API_ENDPOINTS } from './config';
export type {
  TNotification,
  TMessage,
  NotificationType,
  NotificationPriority,
  SocketError,
  UnreadCountPayload,
  NotificationUpdatePayload,
} from './type';

// Documentation and guides
// See MIGRATION_GUIDE.md for migration instructions
// See SOCKET_CENTER_DOCS.md for comprehensive documentation
// See README.md for quick start guide
// See examples/ folder for refactored component examples