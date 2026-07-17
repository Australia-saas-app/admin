import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('affiliate_income')
export class AffiliateIncome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'affiliate_id' })
  @Index()
  affiliateId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['commission', 'bonus', 'withdrawal'],
  })
  type: 'commission' | 'bonus' | 'withdrawal';

  @Column({ name: 'referral_id', nullable: true })
  referralId?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  })
  status: 'pending' | 'paid' | 'cancelled';

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}