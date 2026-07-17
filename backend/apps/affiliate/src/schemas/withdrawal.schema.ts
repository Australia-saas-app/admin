import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WithdrawalDocument = Withdrawal & Document;

@Schema({ timestamps: true })
export class Withdrawal {
  @Prop({ required: true })
  affiliateId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  method: string; // wallet_transfer, bank_transfer, etc.

  @Prop({ default: 'pending' })
  status: string; // pending, approved, rejected, completed

  @Prop()
  processedAt: Date;

  @Prop()
  transactionId: string;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);