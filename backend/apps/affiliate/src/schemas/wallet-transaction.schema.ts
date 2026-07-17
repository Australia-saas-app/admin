import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletTransactionDocument = WalletTransaction & Document;

@Schema({ timestamps: true })
export class WalletTransaction {
  @Prop({ required: true })
  affiliateId: string;

  @Prop({ required: true })
  type: string; // credit, debit, transfer

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop()
  description: string;

  @Prop()
  balanceAfter: number;

  @Prop()
  relatedTransactionId: string;
}

export const WalletTransactionSchema = SchemaFactory.createForClass(WalletTransaction);