import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Entity('blog_tags')
export class BlogTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  slug: string;

  @ManyToMany(() => BlogEntity, (blog) => blog.tagsRelation)
  blogs: BlogEntity[];
}