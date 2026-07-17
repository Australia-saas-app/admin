import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FileObject } from './file.entity';

/**
 * File Share Entity
 *
 * Design Decision - Secure Sharing:
 * - Time-limited share links
 * - Access control (view/download)
 * - Password protection support
 * - Share tracking and analytics
 */
@Entity({ name: 'file_shares' })
export class FileShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Reference to the shared file
   */
  @Column()
  fileId: string;

  /**
   * Unique share token for the URL
   */
  @Column({ unique: true })
  shareToken: string;

  /**
   * User who created the share
   */
  @Column({ nullable: true })
  createdBy?: string;

  /**
   * Optional password for protected shares
   */
  @Column({ nullable: true })
  password?: string;

  /**
   * Access permissions
   */
  @Column({ type: 'jsonb', default: { view: true, download: true } })
  permissions: {
    view: boolean;
    download: boolean;
  };

  /**
   * Expiration date
   */
  @Column({ nullable: true })
  expiresAt?: Date;

  /**
   * Maximum number of accesses (null = unlimited)
   */
  @Column({ type: 'int', nullable: true })
  maxAccesses?: number;

  /**
   * Current access count
   */
  @Column({ type: 'int', default: 0 })
  accessCount: number;

  /**
   * Share is active
   */
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relationship to the file (lazy loaded)
   */
  @ManyToOne(() => FileObject, file => file.shares, { lazy: true })
  file: Promise<FileObject>;
}