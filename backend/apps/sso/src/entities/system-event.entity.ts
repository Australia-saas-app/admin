import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

export enum SystemEventType {
  USER_REGISTRATION = "user_registration",
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  ORDER_CREATED = "order_created",
  ORDER_UPDATED = "order_updated",
  PAYMENT_PROCESSED = "payment_processed",
  SYSTEM_ERROR = "system_error",
  SYSTEM_WARNING = "system_warning",
  CONFIGURATION_CHANGE = "configuration_change",
  SECURITY_EVENT = "security_event",
}

export enum SystemEventSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

@Entity("system_events")
@Index(["eventType", "timestamp"])
@Index(["severity", "timestamp"])
@Index(["service", "timestamp"])
@Index(["timestamp"])
@Index(["resolved", "timestamp"])
export class SystemEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: SystemEventType,
  })
  eventType: SystemEventType;

  @Column({
    type: "enum",
    enum: SystemEventSeverity,
    default: SystemEventSeverity.MEDIUM,
  })
  severity: SystemEventSeverity;

  @Column({ type: "varchar", length: 100 })
  service: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "jsonb", nullable: true })
  data?: Record<string, any>;

  @Column({ type: "varchar", length: 255, nullable: true })
  userId?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  adminId?: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: "boolean", default: false })
  resolved: boolean;

  @Column({ type: "timestamptz", nullable: true })
  resolvedAt?: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  resolvedBy?: string;
}

// Note: TTL functionality for auto-deletion can be implemented via database triggers or scheduled jobs
