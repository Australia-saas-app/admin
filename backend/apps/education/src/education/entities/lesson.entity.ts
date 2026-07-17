import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
} from "typeorm";
import { Course } from "./course.entity";

@Entity("lessons")
@Index(["lessonId"], { unique: true })
@Index(["courseId"])
@Index(["orderIndex"])
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  lessonId: string;

  @Column({ type: "int" })
  courseId: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  videoUrl: string;

  @Column({ type: "text", nullable: true })
  quizData: string; // JSON string for quiz questions

  @Column({ type: "int", default: 0 })
  orderIndex: number;

  @Column({ type: "int", nullable: true })
  durationMinutes: number;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async generateLessonId() {
    if (!this.lessonId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.lessonId = `LESSON-${timestamp}-${random}`.toUpperCase();
    }
  }
}
