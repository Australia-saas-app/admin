import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GalleryDocument = Gallery & Document;

export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

@Schema({ timestamps: true })
export class Gallery {
  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop()
  category?: string;

  @Prop({
    type: {
      fileId: { type: String },
      fileKey: { type: String },
      url: { type: String },
      type: { type: String, enum: Object.values(MediaType) },
      fileName: { type: String },
      mimeType: { type: String },
      size: { type: Number },
    },
  })
  media?: {
    fileId?: string;
    fileKey?: string;
    url?: string;
    type?: MediaType;
    fileName?: string;
    mimeType?: string;
    size?: number;
  };

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({
    type: [
      {
        imageUrl: { type: String, required: true },
        altText: { type: String },
        displayOrder: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  images: Array<{
    imageUrl: string;
    altText?: string;
    displayOrder: number;
  }>;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

GallerySchema.index({ isVisible: 1 });
GallerySchema.index({ category: 1 });
GallerySchema.index({ createdAt: -1 });
