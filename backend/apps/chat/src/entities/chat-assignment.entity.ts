import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('chat_assignments')
export class ChatAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_ASSIGNMENT_CONVERSATION')
  @Column()
  conversationId: string;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Index('IDX_ASSIGNMENT_ADMIN')
  @Column()
  adminId: string;

  @CreateDateColumn()
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  unassignedAt?: Date;

  @Column({ nullable: true })
  reason?: string; // 'offline_timeout', 'manual', 'auto'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
