import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Currency } from './currency.entity';

@Entity('exchange_rates')
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  fromCurrencyId: string;

  @ManyToOne(() => Currency, (currency) => currency.exchangeRatesFrom)
  @JoinColumn({ name: 'fromCurrencyId' })
  fromCurrency: Currency;

  @Column()
  @Index()
  toCurrencyId: string;

  @ManyToOne(() => Currency, (currency) => currency.exchangeRatesTo)
  @JoinColumn({ name: 'toCurrencyId' })
  toCurrency: Currency;

  @Column({ type: 'decimal', precision: 18, scale: 10 })
  rate: number; // Exchange rate (1 fromCurrency = rate toCurrency)

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  effectiveDate: Date; // When this rate became effective

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date; // When this rate expires

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isManual: boolean; // Whether this rate was manually set (vs fetched from API)

  @Column({ type: 'text', nullable: true })
  source: string; // API source (e.g., 'openexchangerates', 'frankfurter', 'manual')

  @Column({ nullable: true })
  updatedBy: string; // User who last updated (for manual rates)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
