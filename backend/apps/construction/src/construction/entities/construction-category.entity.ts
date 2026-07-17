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
import { ConstructionService } from './construction-service.entity';

@Entity('construction_categories')
@Index(['categoryId'], { unique: true })
@Index(['serviceType', 'name'], { unique: true })
@Index(['isActive'])
@Index(['displayOrder'])
export class ConstructionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  categoryId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'construction' })
  serviceType: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ConstructionService, (service) => service.category)
  services: ConstructionService[];

  @BeforeInsert()
  async generateCategoryId() {
    if (!this.categoryId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.categoryId = `CONST-CAT-${timestamp}-${random}`.toUpperCase();
    }
  }
}


