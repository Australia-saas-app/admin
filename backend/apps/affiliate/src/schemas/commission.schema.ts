import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommissionDocument = Commission & Document;

@Schema({ timestamps: true })
export class Commission {
  @Prop({ required: true })
  affiliateId: string;

  @Prop({ required: true })
  referralId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 'pending' })
  status: string; // pending, paid, cancelled

  @Prop()
  paidAt: Date;

  @Prop()
  transactionId: string;
}

export const CommissionSchema = SchemaFactory.createForClass(Commission);