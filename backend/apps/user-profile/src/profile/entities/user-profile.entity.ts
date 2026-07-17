import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserContact } from './user-contact.entity';

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BLOCK = 'block',
  DORMANT = 'dormant',
  CLOSED = 'closed',
}

export enum IdentityType {
  NATIONAL_ID = 'national_id',
  PASSPORT = 'passport',
  DRIVING_LICENSE = 'driving_license',
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  userId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  profilePhoto: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  identityNumber: string;

  @Column({ type: 'enum', enum: IdentityType, nullable: true })
  identityType: IdentityType;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentUrl: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string;

  @Column({ type: 'text', nullable: true })
  permanentAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode: string;

  @OneToMany(() => UserContact, (contact) => contact.profile, {
    cascade: true,
    eager: false,
  })
  contacts: UserContact[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  recoveryDeadline: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastProfileUpdateAt: Date;
}
