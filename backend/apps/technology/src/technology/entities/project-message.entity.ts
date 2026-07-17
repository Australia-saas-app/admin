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

export enum MessageType {
  GENERAL = 'general',
  UPDATE = 'update',
  COMMENT = 'comment',
  SYSTEM = 'system',
}

@Entity('project_messages')
@Index(['projectId'])
@Index(['senderId'])
@Index(['messageType'])
export class ProjectMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  projectId: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'varchar', length: 255 })
  senderId: string;

  @Column({ type: 'varchar', length: 255 })
  senderName: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.GENERAL,
  })
  messageType: MessageType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
