import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('user_notification_preferences')
export class UserNotificationPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  notificationType: string; // order_updates, promotions, security, etc.

  @Column({ type: 'jsonb', default: {} })
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  schedule: {
    startTime?: string; // HH:mm format
    endTime?: string; // HH:mm format
    daysOfWeek?: number[]; // 0-6, Sunday = 0
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}