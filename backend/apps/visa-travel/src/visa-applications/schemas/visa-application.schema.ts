import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApplicationStatus } from '../../common/status.constants';

export type VisaApplicationDocument = HydratedDocument<VisaApplication>;

@Schema({ timestamps: true })
export class VisaApplication {
  @Prop({ required: false })
  userId?: string;

  @Prop({ required: false })
  agencyId?: string;

  @Prop({ required: true })
  passportNo: string;

  @Prop({ required: false })
  passportExpiry?: Date;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: true })
  visaType: string;

  @Prop({ required: false })
  travelClass?: string;

  @Prop({ required: false })
  visaStatus?: string;

  @Prop({ required: false })
  visaNumber?: string;

  @Prop({ required: true })
  destination: string;

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

  @Prop({ type: [String], default: [] })
  passengers: string[];

  @Prop({ type: Object, default: {} })
  dates: {
    departure?: Date;
    return?: Date;
  };

  @Prop({ required: false, default: 0 })
  budget?: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({ required: true, default: 'draft' })
  status: ApplicationStatus;

  @Prop({ required: false })
  assignedAdminId?: string;

  @Prop({ required: true, default: 'everyone' })
  accessScope: 'everyone' | 'private';

  @Prop({ required: false })
  referenceName?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [String], default: [] })
  documents: string[];

  @Prop({
    type: Object,
    default: { total: 0, paid: 0, due: 0 },
  })
  amount: {
    total: number;
    paid: number;
    due: number;
  };

  @Prop({ type: Object, default: {} })
  metadata: Record<string, unknown>;

  @Prop({ required: true, default: true })
  chatEnabled: boolean;

  @Prop({ required: true, default: true })
  callEnabled: boolean;

  @Prop({ required: true, default: true })
  fileEnabled: boolean;

  @Prop({ required: true, default: true })
  voiceEnabled: boolean;
}

export const VisaApplicationSchema = SchemaFactory.createForClass(VisaApplication);

