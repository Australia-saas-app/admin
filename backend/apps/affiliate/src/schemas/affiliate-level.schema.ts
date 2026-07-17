import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AffiliateLevelDocument = AffiliateLevel & Document;

@Schema({ timestamps: true })
export class AffiliateLevel {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  minReferrals: number;

  @Prop({ required: true })
  minEarnings: number;

  @Prop({ required: true })
  commissionRate: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  benefits: string[];
}

export const AffiliateLevelSchema = SchemaFactory.createForClass(AffiliateLevel);