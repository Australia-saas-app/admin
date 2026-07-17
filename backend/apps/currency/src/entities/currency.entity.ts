import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ExchangeRate } from './exchange-rate.entity';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 3 })
  @Index()
  code: string; // USD, EUR, GBP, etc.

  @Column({ length: 100 })
  name: string; // US Dollar, Euro, British Pound, etc.

  @Column({ length: 10, nullable: true })
  symbol: string; // $, €, £, etc.

  @Column({ length: 5, nullable: true })
  locale: string; // en-US, en-GB, etc.

  @Column({ type: 'int', default: 2 })
  decimalPlaces: number; // Number of decimal places (e.g., 2 for USD)

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 1 })
  exchangeRateToBase: number; // Exchange rate relative to base currency (default 1)

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isBase: boolean; // Base currency for the system

  @Column({ default: false })
  isCrypto: boolean; // Whether this is a cryptocurrency

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 10, default: 'left' })
  symbolPosition: string; // 'left' or 'right'

  @Column({ length: 10, default: ',' })
  thousandSeparator: string;

  @Column({ length: 10, default: '.' })
  decimalSeparator: string;

  @OneToMany(() => ExchangeRate, (rate) => rate.fromCurrency)
  exchangeRatesFrom: ExchangeRate[];

  @OneToMany(() => ExchangeRate, (rate) => rate.toCurrency)
  exchangeRatesTo: ExchangeRate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
