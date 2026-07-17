import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Admin } from "./admin.entity";

@Entity("branches")
export class Branch {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  branchName: string;

  @Column({ type: "varchar", length: 10, nullable: true })
  countryFlag?: string;

  @Column({ type: "text" })
  address: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  emailAddress?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  workingHours?: string;

  @Column({ type: "simple-array", nullable: true })
  workingDays?: string[];

  @Column({ type: "simple-array", default: "" })
  services: string[];

  @Column({ type: "jsonb", nullable: true })
  socialLinks?: Array<{
    name: string;
    url: string;
  }>;

  @Column({ type: "boolean", default: true })
  isVisible: boolean;

  @Column({ type: "int", default: 0 })
  displayOrder: number;

  @Column({ type: "uuid", nullable: true })
  createdBy?: string;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator?: Admin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
