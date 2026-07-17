import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Folder } from './folder.entity';
import { FileVersion } from './file-version.entity';
import { FileShare } from './file-share.entity';

/**
 * File Entity
 * 
 * Design Decision - User Details Storage:
 * - Only stores ownerId (string reference) - NOT full user details
 * - User details (name, email, etc.) should be fetched from User Profile Service
 * - This follows microservices principle: single source of truth
 * - Prevents data duplication and sync issues
 * 
 * To get user details:
 * - Call User Profile Service API: GET /api/user-profile/{ownerId}
 * - Or use the userId from JWT token payload (available in request.user)
 */
@Entity({ name: 'files' })
export class FileObject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  filename: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  /**
   * Owner/User ID reference (string)
   * - Only stores the ID, NOT full user details
   * - Fetch user details from User Profile Service when needed
   */
  @Column({ nullable: true })
  ownerId?: string;

  /**
   * Folder ID reference (nullable for root level files)
   */
  @Column({ nullable: true })
  folderId?: string;

  /**
   * Relationship to folder (lazy loaded)
   */
  @ManyToOne(() => Folder, folder => folder.files, { lazy: true, nullable: true })
  folder?: Promise<Folder>;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @Column({ type: 'varchar', length: 32, default: 'pending' })
  scanStatus: 'pending' | 'clean' | 'infected' | 'skipped' | 'error';

  @Column({ type: 'jsonb', nullable: true })
  scanResult?: Record<string, any>;

  @Column({ default: false })
  isDeleted: boolean;

  /**
   * Current version number
   */
  @Column({ type: 'int', default: 1 })
  currentVersion: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * File versions (lazy loaded)
   */
  @OneToMany(() => FileVersion, version => version.file, { lazy: true , nullable: true})
  versions: Promise<FileVersion[]>;

  /**
   * File shares (lazy loaded)
   */
  @OneToMany(() => FileShare, share => share.file, { lazy: true, nullable: true })
  shares: Promise<FileShare[]>;
}

