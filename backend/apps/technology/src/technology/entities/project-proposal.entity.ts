import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Project } from './project.entity';
import { PaymentType } from '../enums/payment-type.enum';


@Entity('project_proposals')
export class ProjectProposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  proposalId: string;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.proposals)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'text' })
  proposal: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  timeline: string;

  @Column({
    type: 'enum',
    enum: PaymentType,
    enumName: 'PaymentType',
  })
  paymentType: PaymentType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async generateProposalId() {
    if (!this.proposalId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.proposalId = `PROP-${timestamp}-${random}`.toUpperCase();
    }
  }
}
