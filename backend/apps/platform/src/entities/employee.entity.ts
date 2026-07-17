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
import { Branch } from "./branch.entity";
import { User } from "./user.entity";
import { Admin } from "./admin.entity";

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  firstName: string;

  @Column({ type: "varchar", length: 255 })
  lastName: string;

  @Column({ type: "varchar", length: 255 })
  position: string;

  @Column({ type: "varchar", length: 255 })
  department: string;

  @Column({ type: "uuid", nullable: true })
  branchId?: string;

  @Column({ type: "varchar", length: 50 })
  employeeId: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  salary?: number;

  @Column({ type: "date", nullable: true })
  hireDate?: Date;

  @Column({ type: "text", nullable: true })
  bio?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  photoUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  linkedinUrl?: string;

  @Column({ type: "boolean", default: true })
  isVisible: boolean;

  @Column({ type: "int", default: 0 })
  displayOrder: number;

  @Column({ type: "uuid", nullable: true })
  managerId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager?: User;



  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branchId' })
  branch?: Branch;

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
