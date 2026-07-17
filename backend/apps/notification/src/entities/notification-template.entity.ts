import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column()
  type: string; // welcome, order_confirmation, password_reset, etc.

  @Column({ nullable: true })
  description: string;

  @Column()
  subject: string; // For email templates

  @Column({ type: 'text' })
  content: string; // Template content with placeholders like {{userName}}, {{orderId}}

  @Column({ type: 'jsonb', default: [] })
  variables: string[]; // List of required variables for the template

  @Column({ type: 'jsonb', default: {} })
  metadata: any; // Additional template metadata

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}