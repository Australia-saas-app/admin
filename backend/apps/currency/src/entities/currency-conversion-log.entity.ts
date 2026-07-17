import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('currency_conversion_logs')
export class CurrencyConversionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  fromCurrencyCode: string;

  @Column()
  toCurrencyCode: string;

  @Column({ type: 'decimal', precision: 20, scale: 6 })
  fromAmount: number;

  @Column({ type: 'decimal', precision: 20, scale: 6 })
  toAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 10 })
  exchangeRate: number;

  @Column({ nullable: true })
  serviceName: string; // Which service initiated the conversion (e.g., 'order', 'payment', 'wallet')

  @Column({ nullable: true })
  referenceId: string; // Order ID, Payment ID, etc.

  @Column({ nullable: true })
  referenceType: string; // Type of transaction

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Additional data

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
