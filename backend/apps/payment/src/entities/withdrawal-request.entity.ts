import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum WithdrawalRequestStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REJECTED = 'rejected',
}

@Entity('withdrawal_requests')
@Index(['businessUserId'])
@Index(['status'])
@Index(['requestId'], { unique: true })
export class WithdrawalRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  requestId: string;

  @Column({ type: 'varchar', length: 26 })
  businessUserId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  stripeAccountId: string;

  @Column({
    type: 'enum',
    enum: WithdrawalRequestStatus,
    default: WithdrawalRequestStatus.PENDING,
  })
  status: WithdrawalRequestStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeTransferId: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  relatedTransactionId: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  reviewedByAdminId: string | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  processedAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

