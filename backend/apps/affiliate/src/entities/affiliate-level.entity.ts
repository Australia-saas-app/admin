import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('affiliate_levels')
export class AffiliateLevel {
  @PrimaryGeneratedColumn('uuid')
    id: string;
  
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column()
  minReferrals: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minEarnings: number;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  commissionRate: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', array: true, default: [] })
  benefits: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}