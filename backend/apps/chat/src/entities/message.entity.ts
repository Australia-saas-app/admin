import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('chat_messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_MESSAGE_CONVERSATION')
  @Column()
  conversationId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Index('IDX_MESSAGE_SENDER')
  @Column()
  senderId: string;

  @Column({ type: 'varchar', length: 20 })
  senderType: string; // 'user', 'business', 'admin', 'sub-admin'

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  senderName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  receiverName?: string;

  @Column({ type: 'varchar', length: 20, default: 'text' })
  messageType: string; // 'text', 'file', 'voice', 'call'

  @Column({ type: 'jsonb', default: [] })
  attachments: Array<{
    filename: string;
    url: string;
    mimeType: string;
    size: number;
  }>;

  @Column({ nullable: true })
  voiceUrl?: string;

  @Column({ type: 'int', nullable: true })
  callDuration?: number;

  @Column({ type: 'jsonb', default: [] })
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;

  @Index('IDX_MESSAGE_CREATED_AT')
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
