import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  affiliateId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'info' })
  type: string; // info, success, warning, error

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt: Date;

   @Prop({ type: MongooseSchema.Types.Mixed })
   metadata: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);