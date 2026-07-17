import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BookingStatus } from '../../common/status.constants';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: false })
  userId?: string;

  @Prop({ required: false })
  agencyId?: string;

  @Prop({ required: false })
  packageId?: string;

  @Prop({ required: true, default: false })
  customTrip: boolean;

  @Prop({ required: true, default: 'pending' })
  status: BookingStatus;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({ required: false })
  contactPhone?: string;

  @Prop({ required: false })
  contactEmail?: string;

  @Prop({ type: Object, default: {} })
  currentAddress?: {
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    address?: string;
  };

  @Prop({ type: Object, default: {} })
  destinationAddress?: {
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    address?: string;
  };

  @Prop({ required: true, default: 0 })
  paid: number;

  @Prop({ required: true, default: 0 })
  due: number;

  @Prop({ required: true, default: 0 })
  profit: number;

  @Prop({
    type: [
      {
        kind: { type: String, required: true, enum: ['payment', 'refund'] },
        amount: { type: Number, required: true },
        fee: { type: Number, required: false, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  transactions: {
    kind: 'payment' | 'refund';
    amount: number;
    fee?: number;
    createdAt: Date;
  }[];

  @Prop({ required: false })
  referenceName?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [String], default: [] })
  passengers: string[];

  @Prop({ type: [String], default: [] })
  documents: string[];

  @Prop({ type: Object, default: {} })
  dates: {
    start?: Date;
    end?: Date;
  };

  @Prop({ required: false })
  deliveryFileKey?: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, unknown>;

  @Prop({ required: false })
  assignedAdminId?: string;

  @Prop({ required: true, default: 'everyone' })
  accessScope: 'everyone' | 'private';

  @Prop({ required: true, default: true })
  chatEnabled: boolean;

  @Prop({ required: true, default: true })
  callEnabled: boolean;

  @Prop({ required: true, default: true })
  fileEnabled: boolean;

  @Prop({ required: true, default: true })
  voiceEnabled: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

