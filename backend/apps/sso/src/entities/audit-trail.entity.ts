import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

export enum PerformedByType {
  ADMIN = "admin",
  USER = "user",
  SYSTEM = "system",
}

@Entity("audit_trails")
@Index(["entityType", "entityId", "timestamp"])
@Index(["performedBy", "timestamp"])
@Index(["action", "timestamp"])
@Index(["timestamp"])
export class AuditTrail {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  entityType: string;

  @Column({ type: "varchar", length: 255 })
  entityId: string;

  @Column({ type: "varchar", length: 100 })
  action: string;

  @Column({ type: "varchar", length: 255 })
  performedBy: string;

  @Column({
    type: "enum",
    enum: PerformedByType,
    default: PerformedByType.SYSTEM,
  })
  performedByType: PerformedByType;

  @Column({ type: "jsonb", nullable: true })
  oldValues?: Record<string, any>;

  @Column({ type: "jsonb", nullable: true })
  newValues?: Record<string, any>;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: "text", nullable: true })
  userAgent?: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;
}
