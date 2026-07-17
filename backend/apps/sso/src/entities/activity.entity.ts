import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE_UPDATE = 'profile_update',
  PASSWORD_CHANGE = 'password_change',
  ORDER_PLACED = 'order_placed',
  WALLET_DEPOSIT = 'wallet_deposit',
  WALLET_WITHDRAWAL = 'wallet_withdrawal',
  SESSION_REVOKED = 'session_revoked',
}

@Index(['userId'])
@Index(['type'])
@Index(['createdAt'])
@Index(['userId', 'createdAt'])
@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK → users.userId (ULID / varchar)
  @Column({ type: 'varchar', length: 26 })
  userId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE', // or SET NULL if you prefer audit preservation
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'userId',
  })
  user: User;

  @Column({
    type: 'enum',
    enum: ActivityType,
    enumName: 'activity_type_enum',
  })
  type: ActivityType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
