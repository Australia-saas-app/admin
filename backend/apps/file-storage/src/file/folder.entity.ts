import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FileObject } from './file.entity';

/**
 * Folder Entity
 *
 * Design Decision - Hierarchical Structure:
 * - Supports nested folders via parentId
 * - Full path stored for efficient queries
 * - Owner-based access control
 *
 * To get user details:
 * - Call User Profile Service API: GET /api/user-profile/{ownerId}
 * - Or use the userId from JWT token payload (available in request.user)
 */
@Entity({ name: 'folders' })
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  /**
   * Full path for efficient queries (e.g., "root/documents/legal")
   */
  @Column({ unique: true })
  path: string;

  /**
   * Parent folder ID for hierarchical structure
   * null for root folders
   */
  @Column({ nullable: true })
  parentId?: string;

  /**
   * Owner/User ID reference (string)
   * - Only stores the ID, NOT full user details
   * - Fetch user details from User Profile Service when needed
   */
  @Column({ nullable: true })
  ownerId?: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Files in this folder (lazy loaded)
   */
  @OneToMany(() => FileObject, file => file.folder, { lazy: true })
  files: Promise<FileObject[]>;
}