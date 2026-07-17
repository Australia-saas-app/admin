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

@Entity("enrollments")
@Index(["enrollmentId"], { unique: true })
@Index(["courseId"])
@Index(["studentId"])
@Index(["courseId", "studentId"], { unique: true })
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  enrollmentId: string;

  @Column({ type: "int" })
  courseId: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Column({ type: "varchar", length: 255 })
  studentId: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  studentName: string;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  completionPercentage: number;

  @Column({ type: "boolean", default: false })
  isCompleted: boolean;

  @Column({ type: "boolean", default: false })
  certificateIssued: boolean;

  @Column({ type: "text", nullable: true })
  certificateUrl: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  paidAmount: number;

  @Column({ type: "varchar", length: 3, nullable: true })
  currency: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  paymentMethod: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  transactionId: string;

  @CreateDateColumn()
  enrollmentDate: Date;

  @Column({ type: "timestamp", nullable: true })
  completionDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async generateEnrollmentId() {
    if (!this.enrollmentId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.enrollmentId = `ENROLL-${timestamp}-${random}`.toUpperCase();
    }
  }
}
