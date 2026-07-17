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
import { RealEstateCategory } from './real-estate-category.entity';

@Entity('real_estate_properties')
@Index(['propertyId'], { unique: true })
@Index(['isVisible'])
@Index(['serviceType'])
@Index(['categoryId'])
@Index(['displayOrder'])
@Index(['propertyType'])
@Index(['propertyStatus'])
@Index(['price'])
export class RealEstateProperty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  propertyId: string;

  @Column({ type: 'varchar', length: 255 })
  propertyType: string; // Houses, Flats, Apartments, etc.

  @Column({ type: 'varchar', length: 50 })
  propertyStatus: string; // Rent, Buy, Sale, Mortgage

  @Column({ type: 'varchar', length: 50, nullable: true })
  currentStatus: string; // Vacant, Currently Rented, Under Construction, Ready-to-Move

  @Column({ type: 'json', nullable: true })
  photos: string[]; // Multiple photos as JSON array

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sizeSquareFeet: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'json', nullable: true })
  features: string[]; // Features as JSON array

  // Residential Properties Fields (Houses, Flats, Apartments, Townhouses, Villas, Condominiums, Multi-Family Units)
  @Column({ type: 'int', nullable: true })
  beds: number;

  @Column({ type: 'int', nullable: true })
  bathroom: number;

  @Column({ type: 'int', nullable: true })
  kitchen: number;

  @Column({ type: 'varchar', length: 50, default: 'real-estate' })
  serviceType: string;

  @Column({ type: 'int', nullable: true })
  categoryId: number;

  @ManyToOne(() => RealEstateCategory, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: RealEstateCategory;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoryName: string;

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
  async generatePropertyId() {
    if (!this.propertyId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.propertyId = `RE-${timestamp}-${random}`.toUpperCase();
    }
  }
}


