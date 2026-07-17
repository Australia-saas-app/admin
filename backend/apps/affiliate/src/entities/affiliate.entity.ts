import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Referral } from "./referral.entity";
import { Commission } from "./commission.entity";
import { WalletTransaction } from "./wallet-transaction.entity";
import { Withdrawal } from "./withdrawal.entity";
import { AffiliateProfile } from "./affiliate-profile.entity";

@Entity("affiliates")
export class Affiliate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  referralCode: string;

  @Column({ default: 0, type: "decimal", precision: 10, scale: 2 })
  totalEarnings: number;

  @Column({ default: 0, type: "decimal", precision: 10, scale: 2 })
  pendingEarnings: number;

  @Column({ default: 0 })
  totalReferrals: number;

  @Column({ default: "Bronze" })
  level: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp", nullable: true })
  joinedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Referral, (referral) => referral.affiliate)
  referrals: Referral[];

  @OneToMany(() => Commission, (commission) => commission.affiliate)
  commissions: Commission[];

  @OneToMany(() => WalletTransaction, (transaction) => transaction.affiliate)
  transactions: WalletTransaction[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.affiliate)
  withdrawals: Withdrawal[];

  @OneToOne(() => AffiliateProfile, (profile) => profile.affiliate)
  profile: AffiliateProfile;
}
