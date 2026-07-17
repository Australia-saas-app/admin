import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  notificationId: string; // Reference to the notification

  @Column()
  @Index()
  userId: string; // User who received the notification

  @Column()
  channel: string; // email, sms, push, in-app

  @Column()
  status: string; // sent, delivered, failed, read

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  providerResponse: any; // Response from notification provider

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Additional tracking data

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}