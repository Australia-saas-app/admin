import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  userId: string;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  language: string;

  @Column({ type: 'varchar', length: 50, default: 'system' })
  theme: string; // light, dark, system

  @Column({ type: 'boolean', default: false })
  emailNotifications: boolean;

  @Column({ type: 'boolean', default: false })
  smsNotifications: boolean;

  @Column({ type: 'boolean', default: false })
  pushNotifications: boolean;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  twoFactorMethod: string; // email or phone

  @Column({ type: 'jsonb', nullable: true })
  notificationSettings: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  privacySettings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
