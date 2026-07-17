import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { CommercialIndustrialCategory } from './commercial-industrial-category.entity';

@Entity('commercial_industrial_services')
@Index(['serviceId'], { unique: true })
@Index(['isVisible'])
@Index(['serviceType'])
@Index(['categoryId'])
@Index(['displayOrder'])
export class CommercialIndustrialService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  serviceId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  photo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tag: string;

  @Column({ type: 'varchar', length: 50, default: 'commercial-industrial' })
  serviceType: string;

  @Column({ type: 'int', nullable: true })
  categoryId: number;

  @ManyToOne(() => CommercialIndustrialCategory, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: CommercialIndustrialCategory;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoryName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async generateServiceId() {
    if (!this.serviceId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.serviceId = `COMIND-${timestamp}-${random}`.toUpperCase();
    }
  }
}
