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

@Entity('oauth_authorization_codes')
export class OAuthAuthorizationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'code', type: 'varchar', length: 128, unique: true })
  code: string;

  @Column({ name: 'code_challenge', type: 'varchar', length: 128, nullable: true })
  codeChallenge?: string;

  @Column({ name: 'code_challenge_method', type: 'varchar', length: 10, nullable: true })
  codeChallengeMethod?: string;

  @Column({ name: 'redirect_uri', type: 'text' })
  redirectUri: string;

  @Column({ name: 'scopes', type: 'text', array: true })
  scopes: string[];

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'consent_required', type: 'boolean', default: false })
  consentRequired: boolean;

  @Column({ name: 'nonce', type: 'varchar', length: 255, nullable: true })
  nonce?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => OAuthClient, (client) => client.authorizationCodes, {
    onDelete: 'CASCADE',
  })
  client: OAuthClient;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  sessionId?: string;
}


