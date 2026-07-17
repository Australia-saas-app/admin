import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';

export enum ParticipantRole {
  ADMIN = 'admin',
  SUB_ADMIN = 'sub_admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

@Entity('project_participants')
@Index(['projectId', 'userId'], { unique: true })
@Index(['projectId'])
@Index(['userId'])
@Index(['role'])
export class ProjectParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  projectId: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  userName: string;

  @Column({
    type: 'enum',
    enum: ParticipantRole,
    default: ParticipantRole.MEMBER,
  })
  role: ParticipantRole;

  @Column({ type: 'varchar', length: 50, nullable: true })
  accountType: string; // user, agency, business

  @Column({ type: 'varchar', length: 255, nullable: true })
  invitedBy: string;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
