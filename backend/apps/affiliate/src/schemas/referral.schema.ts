import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReferralDocument = Referral & Document;

@Schema({ timestamps: true })
export class Referral {
  @Prop({ required: true })
  affiliateId: string;

  @Prop({ required: true })
  referredUserId: string;

  @Prop({ required: true })
  referralCode: string;

  @Prop({ default: 'pending' })
  status: string; // pending, completed, cancelled

  @Prop()
  commissionEarned: number;

  @Prop()
  completedAt: Date;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);