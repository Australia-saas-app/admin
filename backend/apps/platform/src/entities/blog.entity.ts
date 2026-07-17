import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { BlogCategoryEntity } from './blog-category.entity';
import { BlogTagEntity } from './blog-tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Admin } from './admin.entity';

@Entity('blogs')
export class BlogEntity {
  @ApiProperty({
    description: 'Blog unique identifier',
    example: 'f8a2b5c4-6d9e-4f8a-9b7c-3d5e6f8a9b0c'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Blog title',
    example: 'Getting Started with TypeScript'
  })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({
    description: 'Blog slug for URL',
    example: 'getting-started-with-typescript'
  })
  @Column({ length: 200, unique: true })
  slug: string;

  @ApiProperty({
    description: 'Blog excerpt/summary',
    example: 'A comprehensive guide to TypeScript basics...'
  })
  @Column({ type: 'text', nullable: true })
  excerpt?: string;

  @ApiProperty({
    description: 'Full blog content',
    example: '# Getting Started\n\nTypeScript is a typed superset...'
  })
  @Column('text')
  content: string;

  @ApiProperty({
    description: 'Blog category',
    example: 'Technology'
  })
  @Column({ length: 100, nullable: true })
  category?: string;

  @ApiProperty({
    description: 'Blog tags',
    example: ['typescript', 'programming', 'tutorial']
  })
  @Column('simple-array', { nullable: true })
  tags?: string[];

  @ApiProperty({
    description: 'Blog photo',
    required: false
  })
  @Column({ type: 'jsonb', nullable: true })
  photo?: {
    fileId?: string;
    fileKey?: string;
    url?: string;
    fileName?: string;
    mimeType?: string;
    size?: number;
  };

  @ApiProperty({
    description: 'Blog visibility status',
    example: true
  })
  @Column({ default: true })
  isVisible: boolean;

  @ApiProperty({
    description: 'View count',
    example: 150
  })
  @Column({ default: 0 })
  viewCount: number;

  @ApiProperty({
    description: 'Like count',
    example: 25
  })
  @Column({ default: 0 })
  likeCount: number;

  @ApiProperty({
    description: 'Author ID',
    example: 'user-123',
    required: false
  })
  @Column({ type: "uuid", nullable: true })
  authorId?: string;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'authorId' })
  author?: Admin;

  @ManyToMany(() => BlogCategoryEntity, (category) => category.blogs)
  categories: BlogCategoryEntity[];

  @ManyToMany(() => BlogTagEntity, (tag) => tag.blogs)
  tagsRelation: BlogTagEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
