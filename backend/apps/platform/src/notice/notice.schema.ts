import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type NoticeDocument = Notice & Document;

@Schema({ timestamps: true })
export class Notice {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ["low", "medium", "high"], default: "medium" })
  priority: string;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: Number, default: 0 })
  displayOrder: number;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);

// Indexes
NoticeSchema.index({ isVisible: 1 });
NoticeSchema.index({ priority: 1 });
NoticeSchema.index({ displayOrder: 1 });
NoticeSchema.index({ createdAt: -1 });
