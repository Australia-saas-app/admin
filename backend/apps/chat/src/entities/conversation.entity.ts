import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Message } from './message.entity';

@Entity('chat_conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  type: string; // 'live', 'order', 'business'

  @Column('text', { array: true })
  participants: string[];

  @Index('IDX_CONVERSATION_ORDER_ID')
  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  topic?: string;

  @Index('IDX_CONVERSATION_ASSIGNED_ADMIN')
  @Column({ nullable: true })
  assignedAdminId?: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // 'active', 'closed', 'blocked'

  @Column({ type: 'text', nullable: true })
  lastMessage?: string;

  @Column({ type: 'jsonb', default: {} })
  unreadCount: { [key: string]: number };

  @Column({ type: 'jsonb', default: {} })
  participantNames: { [key: string]: string };

  @Column({ default: true })
  messageEnabled: boolean;

  @Column({ default: false })
  callEnabled: boolean;

  @Column({ default: false })
  fileUploadEnabled: boolean;

  @Column({ default: false })
  voiceUploadEnabled: boolean;

  @Index('IDX_CONVERSATION_EXPIRES_AT')
  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  customExpiration?: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  rating?: string; // 'yes', 'no'

  @Column({ nullable: true })
  blockedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt?: Date;

  @Column('text', { array: true, default: [] })
  permittedSubAdmins?: string[];

  @Column({ type: 'jsonb', nullable: true })
  userLastSeenAt?: { [key: string]: Date };

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
