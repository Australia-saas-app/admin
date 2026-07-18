export type TConversation = {
  _id?: string;
  type: MessageType;
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  serviceType: string;
  conversationId: string;
  createdAt?: Date;
  updatedAt?: Date;
  orderId?: string; // if type is order:
  receiverUserId?: string;
};

type IFile = {
  image?: string;
  video?: string;
  audio?: string;
  document?: string;
};

type MessageType = "live" | "order";

export type Authority = "user" | "admin" | "sub_admin";

export type TMessage = {
  _id?: string;
  type: MessageType;
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  content: string;
  conversationId: string;
  serviceType: string;
  file?: IFile;
  createdAt?: Date;
  updatedAt?: Date;
  orderId?: string; // if type is order:
  authority?: Authority;
  receiverUserId?: string;
};
