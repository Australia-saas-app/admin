import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  BeforeInsert,
} from "typeorm";
import { EducationCategory } from "./education-category.entity";
import { Lesson } from "./lesson.entity";
import { Enrollment } from "./enrollment.entity";

@Entity("courses")
@Index(["courseId"], { unique: true })
@Index(["isVisible"])
@Index(["categoryId"])
@Index(["displayOrder"])
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  courseId: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  thumbnail: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  tag: string;

  @Column({ type: "varchar", length: 50, default: "education" })
  serviceType: string;

  @Column({ type: "int", nullable: true })
  categoryId: number;

  @ManyToOne(() => EducationCategory, { nullable: true })
  @JoinColumn({ name: "categoryId" })
  category: EducationCategory;

  @Column({ type: "varchar", length: 255, nullable: true })
  categoryName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  instructorId: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  instructorName: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency: string;

  @Column({ type: "int", nullable: true })
  durationHours: number;

  @Column({ type: "text", nullable: true })
  videoUrls: string; // JSON string of video URLs

  @Column({ type: "boolean", default: true })
  isVisible: boolean;

  @Column({ type: "int", default: 0 })
  displayOrder: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  createdBy: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @BeforeInsert()
  async generateCourseId() {
    if (!this.courseId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.courseId = `EDU-${timestamp}-${random}`.toUpperCase();
    }
  }
}
