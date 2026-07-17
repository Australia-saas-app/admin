import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BranchDocument = Branch & Document;

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true })
  branchName: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  workingHours?: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: Number, default: 0 })
  displayOrder: number;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

// Indexes
BranchSchema.index({ isVisible: 1 });
BranchSchema.index({ displayOrder: 1 });
BranchSchema.index({ createdAt: -1 });
