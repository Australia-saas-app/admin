import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Conversation' })
  conversationId: Types.ObjectId;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true, enum: ['user', 'agency', 'admin', 'sub-admin'] })
  senderType: string;

  @Prop({ type: String })
  content?: string;

  @Prop({ required: true, enum: ['text', 'file', 'voice', 'call'], default: 'text' })
  messageType: string;

  @Prop({
    type: [{
      filename: String,
      url: String,
      mimeType: String,
      size: Number,
    }],
    default: [],
  })
  attachments?: Array<{
    filename: string;
    url: string;
    mimeType: string;
    size: number;
  }>;

  @Prop({ type: String })
  voiceUrl?: string;

  @Prop({ type: Number })
  callDuration?: number;

  @Prop({
    type: [{
      userId: String,
      readAt: Date,
    }],
    default: [],
  })
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ createdAt: -1 });

