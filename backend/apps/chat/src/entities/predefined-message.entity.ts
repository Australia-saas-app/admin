import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('predefined_messages')
export class PredefinedMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_PREDEFINED_ADMIN')
  @Column()
  adminId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Index('IDX_PREDEFINED_CATEGORY')
  @Column({ nullable: true })
  category?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
