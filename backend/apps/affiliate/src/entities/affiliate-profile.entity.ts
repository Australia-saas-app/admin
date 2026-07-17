import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Affiliate } from './affiliate.entity';

@Entity('affiliate_profiles')
export class AffiliateProfile {
  @PrimaryColumn()
  userId: string;

  @OneToOne(() => Affiliate, (affiliate) => affiliate.profile)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  affiliate: Affiliate;

  @Column({ nullable: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'jsonb', nullable: true })
  socialLinks: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  commissionAlerts: boolean;

  @Column({ default: true })
  referralAlerts: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}