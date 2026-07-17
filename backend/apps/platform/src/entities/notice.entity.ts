import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Admin } from "./admin.entity";

export enum NoticePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

@Entity("notices")
export class Notice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "jsonb", nullable: true })
  file?: {
    fileId?: string;
    fileKey?: string;
    url?: string;
    fileName?: string;
    mimeType?: string;
    size?: number;
    type?: 'photo' | 'pdf';
  };

  @Column({ type: "enum", enum: NoticePriority, default: NoticePriority.INFO })
  priority: NoticePriority;

  @Column({ type: "boolean", default: true })
  isVisible: boolean;

  @Column({ type: "boolean", default: false })
  isRead: boolean;

  @Column({ type: "timestamp", nullable: true })
  publishAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  expiresAt?: Date;

  @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
  metadata?: Record<string, any>;

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
}
