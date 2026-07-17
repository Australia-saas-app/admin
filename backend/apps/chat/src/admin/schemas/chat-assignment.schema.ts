import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatAssignmentDocument = ChatAssignment & Document;

@Schema({ timestamps: true })
export class ChatAssignment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Conversation' })
  conversationId: Types.ObjectId;

  @Prop({ required: true })
  adminId: string;

  @Prop({ type: Date, default: Date.now })
  assignedAt: Date;

  @Prop({ type: Date })
  unassignedAt?: Date;

  @Prop({ type: String })
  reason?: string; // 'offline_timeout' | 'manual' | 'auto'
}

export const ChatAssignmentSchema = SchemaFactory.createForClass(ChatAssignment);

// Indexes
ChatAssignmentSchema.index({ conversationId: 1 });
ChatAssignmentSchema.index({ adminId: 1 });
ChatAssignmentSchema.index({ assignedAt: -1 });

