import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  BeforeInsert,
} from 'typeorm';
import { RealEstateProperty } from './real-estate-property.entity';

@Entity('real_estate_categories')
@Index(['categoryId'], { unique: true })
@Index(['serviceType', 'name'], { unique: true })
@Index(['isActive'])
@Index(['displayOrder'])
export class RealEstateCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  categoryId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'real-estate' })
  serviceType: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RealEstateProperty, (property) => property.category)
  properties: RealEstateProperty[];

  @BeforeInsert()
  async generateCategoryId() {
    if (!this.categoryId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.categoryId = `RE-CAT-${timestamp}-${random}`.toUpperCase();
    }
  }
}


