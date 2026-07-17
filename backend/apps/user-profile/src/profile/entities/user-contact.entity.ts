import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';

export enum ContactType {
  EMAIL = 'email',
  PHONE = 'phone',
}

@Entity('user_contacts')
export class UserContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  userId: string;

  @ManyToOne(() => UserProfile, (profile) => profile.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  profile: UserProfile;

  @Column({ type: 'varchar', length: 255 })
  value: string; // email or phone number

  @Column({ type: 'enum', enum: ContactType })
  type: ContactType;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'int', default: 0 })
  order: number; // For ordering contacts (0 = primary)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
