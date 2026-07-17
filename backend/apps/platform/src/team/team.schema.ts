import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  position: string;

  @Prop()
  bio?: string;

  @Prop()
  photoUrl?: string;

  @Prop()
  email?: string;

  @Prop()
  linkedinUrl?: string;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: Number, default: 0 })
  displayOrder: number;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

// Indexes
TeamSchema.index({ isVisible: 1 });
TeamSchema.index({ displayOrder: 1 });
TeamSchema.index({ createdAt: -1 });
