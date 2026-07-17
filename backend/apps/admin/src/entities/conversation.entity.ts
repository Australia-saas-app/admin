import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  adminId: string;

  @Column({ default: 'active' })
  status: string; // active, blocked, etc.

  @Column({ default: true })
  messagingEnabled: boolean;

  @Column({ default: true })
  callingEnabled: boolean;

  @Column({ default: true })
  fileUploadEnabled: boolean;

  @Column({ nullable: true })
  orderId: string;

  @Column({ nullable: true })
  agencyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}