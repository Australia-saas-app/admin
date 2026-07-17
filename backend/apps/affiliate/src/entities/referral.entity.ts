import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Affiliate } from './affiliate.entity';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  affiliateId: string;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.referrals)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: Affiliate;

  @Column()
  referredUserId: string;

  @Column()
  referralCode: string;

  @Column({ default: 'pending' })
  status: string; // pending, completed, cancelled

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commissionEarned: number;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}