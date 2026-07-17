import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FileObject } from './file.entity';

/**
 * File Version Entity
 *
 * Design Decision - Version Tracking:
 * - Stores each version of a file separately
 * - Links back to the original file
 * - Maintains version history and metadata
 * - Allows rollback to previous versions
 */
@Entity({ name: 'file_versions' })
export class FileVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Reference to the original file
   */
  @Column()
  fileId: string;

  /**
   * Version number (1, 2, 3, etc.)
   */
  @Column()
  version: number;

  /**
   * Storage key for this version
   */
  @Column()
  key: string;

  @Column()
  filename: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  /**
   * Change description or comment
   */
  @Column({ nullable: true })
  changeDescription?: string;

  /**
   * User who created this version
   */
  @Column({ nullable: true })
  createdBy?: string;

  @Column({ type: 'varchar', length: 32, default: 'clean' })
  scanStatus: 'pending' | 'clean' | 'infected' | 'skipped' | 'error';

  @Column({ type: 'jsonb', nullable: true })
  scanResult?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  /**
   * Relationship to the file (lazy loaded)
   */
  @ManyToOne(() => FileObject, file => file.versions, { lazy: true })
  file: Promise<FileObject>;
}