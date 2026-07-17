import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PredefinedMessageDocument = PredefinedMessage & Document;

@Schema({ timestamps: true })
export class PredefinedMessage {
  @Prop({ required: true })
  adminId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String })
  category?: string;
}

export const PredefinedMessageSchema = SchemaFactory.createForClass(PredefinedMessage);

// Indexes
PredefinedMessageSchema.index({ adminId: 1 });
PredefinedMessageSchema.index({ category: 1 });

