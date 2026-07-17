import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  notificationId: string;

  @Column()
  @Index()
  type: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  relatedEntity: any;

  @Column({ default: 'all-admins' })
  target: string;

  @Column({ nullable: true })
  targetAdminId: string;

  @Column({ type: 'jsonb', default: [] })
  readBy: any;

  @Column({ default: false })
  @Index()
  isRead: boolean;

  @Column({ default: 'medium' })
  priority: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}