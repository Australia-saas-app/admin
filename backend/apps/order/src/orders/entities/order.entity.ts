import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatusHistory } from './order-status-history.entity';
import {
  AccountType,
  OrderAccess,
  OrderStatus,
  OrderType,
} from './order-enums';

export { OrderType, OrderStatus, AccountType, OrderAccess } from './order-enums';

export interface PaymentRecord {
  paymentId: string;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  currency: string;
  paidAt: string;
  note?: string;
}

export interface PricingSnapshot {
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  profitAmount: number;
  currency: string;
  paymentHistory: PaymentRecord[];
}

export interface OrderDocument {
  documentId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AdminFile {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  addedBy: string;
  addedAt: string;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  orderCode: string;

  @Column({ type: 'enum', enum: OrderType, nullable: true })
  orderType: OrderType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'varchar', length: 160, nullable: true })
  serviceName: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  createdById: string;

  @Column({ type: 'enum', enum: AccountType, nullable: true })
  createdByType: AccountType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdByName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdByEmail?: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  createdByPhone?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  assignedToId?: string;

  @Column({ type: 'enum', enum: AccountType, nullable: true })
  assignedToType?: AccountType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  assignedToName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  assignedToEmail?: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  clientInfo: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  orderDetails: Record<string, any>;

  @Column({
    type: 'jsonb',
    default: () =>
      `'{"totalAmount":0,"paidAmount":0,"dueAmount":0,"profitAmount":0,"currency":"USD","paymentHistory":[]}'`,
  })
  pricing: PricingSnapshot;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  documents: OrderDocument[];

  @Column({ type: 'jsonb', default: () => "'[]'" })
  adminFiles: AdminFile[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceName?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: OrderAccess, default: OrderAccess.EVERYONE })
  access: OrderAccess;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'boolean', default: true })
  chatEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expectedDeliveryAt?: Date;

  @OneToMany(() => OrderStatusHistory, (history) => history.order, {
    cascade: true,
  })
  statusHistory: OrderStatusHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizePricing() {
    const pricing = this.pricing ?? {
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      profitAmount: 0,
      currency: 'USD',
      paymentHistory: [],
    };

    pricing.totalAmount = Number(pricing.totalAmount ?? 0);
    pricing.paidAmount = Number(pricing.paidAmount ?? 0);
    pricing.profitAmount = Number(pricing.profitAmount ?? 0);
    pricing.dueAmount = Math.max(pricing.totalAmount - pricing.paidAmount, 0);

    this.pricing = pricing;

    if (
      this.status === OrderStatus.COMPLETE &&
      pricing.totalAmount > 0 &&
      pricing.dueAmount <= 0
    ) {
      this.status = OrderStatus.DELIVERY;
    }
  }
}


