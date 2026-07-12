export type TConversation = {
  _id?: string;
  conversationId: string;
  type: MessageType;
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  serviceType: string;
  createdAt?: Date;
  updatedAt?: Date;
  orderId?: string;
  authority?: string;
  // Group conversation fields
  groupName?: string;
  groupAvatar?: string;
  participants?: string[];
  createdBy?: string;
  isGroup?: boolean;
  // Message preview and count
  lastMessage?: string;
  unreadCount?: number;
};

export type UserPresence = {
  userId: string;
  status: "online" | "offline" | "away" | "typing";
  lastSeen?: Date;
  isTyping?: boolean;
};

export type DeliveryStatus = "sent" | "delivered" | "read" | "failed";

export type MessageDelivery = {
  messageId: string;
  status: DeliveryStatus;
  deliveredAt?: Date;
  readAt?: Date;
};

type IFile = {
  image?: string;
  video?: string;
  audio?: string;
  document?: string;
};

type MessageType = "live" | "order";
type Authority = "user" | "sub_admin" | "admin";

export type TMessage = {
  _id?: string;
  type: MessageType;
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  content: string;
  conversationId: string;
  authority?: Authority;
  serviceType: string;
  file?: IFile;
  createdAt?: Date;
  updatedAt?: Date;
  orderId?: string;
  // Delivery tracking
  deliveryStatus?: DeliveryStatus;
  readAt?: Date;
  // Reactions (optional)
  reactions?: { [userId: string]: string[] };
};

export type State = {
  messages: TMessage[];
  activeTab: "messages" | "forward" | "users";
  onlineUsers: TConversation[];
  conversations: TConversation[];
  filter: {
    query?: string;
    serviceType?: string;
    authority?: string;
  };
  receiverId?: string | null;
  isChatUserSelect?: boolean;
  isSidebarOpen?: boolean;
  selectedUser?: TConversation | null;
  // Presence tracking
  userPresence?: { [userId: string]: UserPresence };
  // Group conversation
  groupConversations?: TConversation[];
  // Typing indicators
  typingUsers?: string[];
  // Call state
  activeCall?: {
    callId: string;
    type: "voice" | "video";
    participant: string;
    startedAt: Date;
  } | null;
};

export type SEtStateAction = {
  type: "SET_STATE";
  payload: State;
};

export type UpdateState = {
  type: "UPDATE_STATE";
  payload: Partial<State>;
};

export type ResetAction = {
  type: "RESET";
};

export type Action = SEtStateAction | UpdateState | ResetAction;
