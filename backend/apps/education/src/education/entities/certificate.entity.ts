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
import { Enrollment } from "./enrollment.entity";

@Entity("certificates")
@Index(["certificateId"], { unique: true })
@Index(["enrollmentId"])
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  certificateId: string;

  @Column({ type: "int" })
  enrollmentId: number;

  @ManyToOne(() => Enrollment)
  @JoinColumn({ name: "enrollmentId" })
  enrollment: Enrollment;

  @Column({ type: "varchar", length: 255 })
  studentName: string;

  @Column({ type: "varchar", length: 255 })
  courseTitle: string;

  @Column({ type: "text", nullable: true })
  certificateUrl: string;

  @Column({ type: "text", nullable: true })
  certificateData: string; // JSON string for certificate details

  @Column({ type: "varchar", length: 255, nullable: true })
  issuedBy: string;

  @CreateDateColumn()
  issuedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async generateCertificateId() {
    if (!this.certificateId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      this.certificateId = `CERT-${timestamp}-${random}`.toUpperCase();
    }
  }
}
