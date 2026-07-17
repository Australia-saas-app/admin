import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('notification_schedules')
export class NotificationSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  notificationType: string;

  @Column({ type: 'jsonb' })
  templateData: any; // Data to be used with template

  @Column({ type: 'jsonb', default: [] })
  targetUsers: string[]; // User IDs to send to

  @Column()
  cronExpression: string; // Cron expression for scheduling

  @Column({ type: 'timestamp' })
  nextRun: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastRun: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: {} })
  channels: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    inApp?: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}