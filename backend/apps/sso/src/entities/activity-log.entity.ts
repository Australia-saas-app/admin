import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity("activity_logs")
@Index(["userId", "timestamp"])
@Index(["adminId", "timestamp"])
@Index(["service", "timestamp"])
@Index(["timestamp"])
@Index(["action", "timestamp"])
export class ActivityLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  userId?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  adminId?: string;

  @Column({ type: "varchar", length: 100 })
  action: string;

  @Column({ type: "varchar", length: 100 })
  service: string;

  @Column({ type: "jsonb", nullable: true })
  details?: Record<string, any>;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: "text", nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  timestamp: Date;
}
