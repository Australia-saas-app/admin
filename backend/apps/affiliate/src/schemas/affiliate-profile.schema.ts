import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AffiliateProfileDocument = AffiliateProfile & Document;

@Schema({ timestamps: true })
export class AffiliateProfile {
  @Prop({ required: true })
  userId: string;

  @Prop()
  displayName: string;

  @Prop()
  bio: string;

  @Prop()
  avatar: string;

   @Prop({ type: MongooseSchema.Types.Mixed })
   socialLinks: {
     website?: string;
     twitter?: string;
     linkedin?: string;
     instagram?: string;
   };

  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: true })
  commissionAlerts: boolean;

  @Prop({ default: true })
  referralAlerts: boolean;
}

export const AffiliateProfileSchema = SchemaFactory.createForClass(AffiliateProfile);