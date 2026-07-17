import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Admin } from "./admin.entity";

export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

@Entity("galleries")
export class Gallery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  title?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  category?: string;

  @Column({ type: "jsonb", nullable: true })
  media?: {
    fileId?: string;
    fileKey?: string;
    url?: string;
    type?: MediaType;
    fileName?: string;
    mimeType?: string;
    size?: number;
  };

  @Column({ type: "boolean", default: true })
  isVisible: boolean;

  @Column({ type: "uuid", nullable: true })
  createdBy?: string;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator?: Admin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  images: {
    imageUrl: string;
    altText?: string;
    displayOrder: number;
  }[];
}
