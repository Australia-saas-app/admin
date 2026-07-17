import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Entity('blog_categories')
export class BlogCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => BlogEntity, (blog) => blog.categories)
  blogs: BlogEntity[];
}