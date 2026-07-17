import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { OAuthClient } from './oauth-client.entity';
import { User } from './user.entity';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  ID = 'id',
}

@Entity('oauth_tokens')
@Index(['tokenType', 'expiresAt'])
export class OAuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'token', type: 'varchar', length: 512, unique: true })
  token: string;

  @Column({ name: 'token_type', type: 'enum', enum: TokenType })
  tokenType: TokenType;

  @Column({ name: 'scopes', type: 'text', array: true })
  scopes: string[];

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'revoked', type: 'boolean', default: false })
  revoked: boolean;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt?: Date;

  @Column({ name: 'parent_token_id', type: 'uuid', nullable: true })
  parentTokenId?: string;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  sessionId?: string;

  @Column({ name: 'client_fingerprint', type: 'varchar', length: 255, nullable: true })
  clientFingerprint?: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 64, nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => OAuthClient, (client) => client.tokens, {
    onDelete: 'CASCADE',
  })
  client: OAuthClient;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;
}


