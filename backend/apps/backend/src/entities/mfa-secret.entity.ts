import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum MfaMethod {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
  WEBAUTHN = 'webauthn',
  BACKUP_CODE = 'backup_code',
}

@Entity('mfa_secrets')
@Index(['user', 'method'])
export class MfaSecret {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ name: 'method', type: 'enum', enum: MfaMethod })
  method: MfaMethod;

  @Column({ name: 'secret', type: 'text', nullable: true })
  secret?: string;

  @Column({ name: 'label', type: 'varchar', length: 255, nullable: true })
  label?: string;

  @Column({ name: 'phone', type: 'varchar', length: 32, nullable: true })
  phone?: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ name: 'webauthn_credential', type: 'jsonb', nullable: true })
  webauthnCredential?: Record<string, any>;

  @Column({ name: 'backup_codes', type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  backupCodes: string[];

  @Column({ name: 'enabled', type: 'boolean', default: true })
  enabled: boolean;

  @Column({ name: 'default_method', type: 'boolean', default: false })
  defaultMethod: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


