import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { ProjectParticipant } from './project-participant.entity';
import { ProjectProposal } from './project-proposal.entity';
import { ProjectTask } from './project-task.entity';
import { ProjectMessage } from './project-message.entity';
import { PaymentType } from '../enums/payment-type.enum';

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}


@Entity('projects')
@Index(['projectId'], { unique: true })
@Index(['status'])
@Index(['createdBy'])
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  projectId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updatedBy: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: PaymentType,
    enumName: 'PaymentType',
    nullable: true,
  })
  paymentType: PaymentType;

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ type: 'int', nullable: true })
  acceptedProposalId: number;

  @OneToMany(() => ProjectProposal, (proposal) => proposal.project)
  proposals: ProjectProposal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProjectParticipant, (participant) => participant.project)
  participants: ProjectParticipant[];

  @OneToMany(() => ProjectTask, (task) => task.project)
  tasks: ProjectTask[];

  @OneToMany(() => ProjectMessage, (message) => message.project)
  messages: ProjectMessage[];

  @BeforeInsert()
  async generateProjectId() {
    if (!this.projectId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.projectId = `PROJ-${timestamp}-${random}`.toUpperCase();
    }
  }
}
