import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatusHistoryDocument = HydratedDocument<StatusHistory>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class StatusHistory {
  @Prop({ required: true })
  entityType: string;

  @Prop({ required: true })
  entityId: string;

  @Prop({ required: false })
  fromStatus?: string;

  @Prop({ required: true })
  toStatus: string;

  @Prop({ required: false })
  actorId?: string;

  @Prop({ required: false })
  note?: string;
}

export const StatusHistorySchema = SchemaFactory.createForClass(StatusHistory);

