import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TravelPackageDocument = HydratedDocument<TravelPackage>;

@Schema({ timestamps: true })
export class TravelPackage {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({ required: true, default: 'visible' })
  status: 'visible' | 'hidden';

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: [String], default: [] })
  media: string[];
}

export const TravelPackageSchema = SchemaFactory.createForClass(TravelPackage);

