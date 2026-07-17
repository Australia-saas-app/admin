import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Admin } from "./admin.entity";

@Entity("contacts")
export class Contact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 20 , nullable: true})
  phone?: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "text", nullable: true })
  subject?: string;

  @Column({ type: "varchar", length: 50, default: "pending" })
  status: string;

  @Column({ type: "boolean", default: true })
  isRead: boolean;

  @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
  metadata?: Record<string, any>;

  @Column({ type: "uuid", nullable: true })
  assignedTo?: string;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignedUser?: Admin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
