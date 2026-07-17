import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AffiliateDocument = Affiliate & Document;

@Schema({ timestamps: true })
export class Affiliate {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  referralCode: string;

  @Prop({ default: 0 })
  totalEarnings: number;

  @Prop({ default: 0 })
  pendingEarnings: number;

  @Prop({ default: 0 })
  totalReferrals: number;

  @Prop({ default: 'Bronze' })
  level: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  joinedAt: Date;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);