import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
  Index,
} from 'typeorm';
import { OAuthAuthorizationCode } from './oauth-authorization-code.entity';
import { OAuthToken } from './oauth-token.entity';

@Entity('oauth_clients')
@Unique(['clientId'])
export class OAuthClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'client_id', type: 'varchar', length: 64 })
  clientId: string;

  @Column({ name: 'client_secret', type: 'varchar', length: 128 })
  clientSecret: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'redirect_uris', type: 'text', array: true })
  redirectUris: string[];

  @Column({ name: 'post_logout_redirect_uris', type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  postLogoutRedirectUris: string[];

  @Column({ name: 'grants', type: 'text', array: true })
  grants: string[];

  @Column({ name: 'scopes', type: 'text', array: true })
  scopes: string[];

  @Column({ name: 'first_party', type: 'boolean', default: false })
  firstParty: boolean;

  @Column({ name: 'require_pkce', type: 'boolean', default: true })
  requirePkce: boolean;

  @Column({ name: 'allow_plain_pkce', type: 'boolean', default: false })
  allowPlainPkce: boolean;

  @Column({ name: 'enabled', type: 'boolean', default: true })
  enabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OAuthAuthorizationCode, (code) => code.client)
  authorizationCodes: OAuthAuthorizationCode[];

  @OneToMany(() => OAuthToken, (token) => token.client)
  tokens: OAuthToken[];
}


