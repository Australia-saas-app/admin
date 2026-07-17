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
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
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
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Blog slug for URL',
    example: 'getting-started-with-typescript'
  })
  @Column({ length: 200, unique: true })
  @IsString()
  @MaxLength(200)
  slug: string;

  @ApiProperty({
    description: 'Blog content/excerpt',
    example: 'A comprehensive guide to TypeScript basics...'
  })
  @Column('text')
  @IsNotEmpty()
  @IsString()
  excerpt: string;

  @ApiProperty({
    description: 'Full blog content',
    example: '# Getting Started\n\nTypeScript is a typed superset...'
  })
  @Column('text')
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Blog category',
    example: 'Technology'
  })
  @Column({ length: 100, nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Blog tags',
    example: ['typescript', 'programming', 'tutorial']
  })
  @Column('simple-array', { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({
    description: 'Featured image URL',
    example: 'https://example.com/blog-image.jpg',
    required: false
  })
  @Column({ nullable: true })
  @IsOptional()
  featuredImage?: string;

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
  @Column({ type: 'uuid', nullable: true })
  authorId?: string;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'authorId' })
  author?: Admin;

  @ApiProperty({
    description: 'Blog categories',
    type: [BlogCategoryEntity]
  })
  @ManyToMany(() => BlogCategoryEntity, (category) => category.blogs)
  categories: BlogCategoryEntity[];

  @ApiProperty({
    description: 'Blog tags',
    type: [BlogTagEntity]
  })
  @ManyToMany(() => BlogTagEntity, (tag) => tag.blogs)
  tagsRelation: BlogTagEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

export { BlogEntity as Blog };
