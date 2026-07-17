import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify, JwtPayload } from 'jsonwebtoken';

export interface UserTokenPayload extends JwtPayload {
  userId?: string;
  agencyId?: string;
  adminId?: string;
  sub: string;
  email?: string;
  role?: string;
  accountType?: string;
  clientId?: string;
}

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  private readonly publicKey: string;
  private readonly issuer: string;
  private readonly logger = new Logger(SimpleAuthGuard.name);

  constructor(private readonly configService: ConfigService) {
    const rawPublicKey = this.configService.get<string>('SSO_PUBLIC_KEY');
    
    if (!rawPublicKey) {
      this.logger.warn(
        'SSO_PUBLIC_KEY not configured. JWT verification disabled. ' +
        'Set SSO_PUBLIC_KEY environment variable to enable real JWT verification.'
      );
      this.publicKey = '';
    } else {
      let formattedKey = rawPublicKey;
      formattedKey = formattedKey.replace(/\\n/g, '\n');
      formattedKey = formattedKey.replace(/\\\\n/g, '\n');
      formattedKey = formattedKey.replace(/\\r/g, '');
      formattedKey = formattedKey.replace(/\r\n/g, '\n');
      formattedKey = formattedKey.trim();
      
      if (!formattedKey.includes('\n') && formattedKey.includes('-----BEGIN')) {
        const beginMatch = formattedKey.match(/-----BEGIN[^-]+-----/);
        const endMatch = formattedKey.match(/-----END[^-]+-----/);
        const base64Part = formattedKey
          .replace(/-----BEGIN[^-]+-----/, '')
          .replace(/-----END[^-]+-----/, '')
          .replace(/\s/g, '');
        
        if (beginMatch && endMatch && base64Part) {
          const formattedBase64 = base64Part.match(/.{1,64}/g)?.join('\n') || base64Part;
          formattedKey = `${beginMatch[0]}\n${formattedBase64}\n${endMatch[0]}\n`;
        }
      }
      
      this.publicKey = formattedKey;
      this.logger.log(`Public key loaded. Length: ${this.publicKey.length}, Has newlines: ${this.publicKey.includes('\n')}`);
    }
    
    this.issuer = this.configService.get<string>('SSO_ISSUER', 'http://localhost:3001/sso');
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    
    if (req.url && (req.url.includes('/health') || req.url.endsWith('/health'))) {
      return true;
    }
    
    const auth = req.headers['authorization'];
    if (!auth || !auth.toString().toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = auth.split(' ')[1];
    
    const skipVerificationRaw = this.configService.get<string>('SKIP_JWT_VERIFICATION', 'false');
    const skipVerification = skipVerificationRaw.toLowerCase() === 'true';
    
    this.logger.debug(`SKIP_JWT_VERIFICATION: ${skipVerificationRaw}, parsed: ${skipVerification}, publicKey exists: ${!!this.publicKey}`);
    
    if (skipVerification || !this.publicKey) {
      if (skipVerification) {
        this.logger.warn('⚠️  JWT verification is DISABLED (SKIP_JWT_VERIFICATION=true). This should only be used for testing!');
      } else {
        this.logger.debug('SSO_PUBLIC_KEY not configured. Accepting token without verification.');
      }

      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString()) as UserTokenPayload;

          const userId = payload.userId || payload.agencyId || payload.adminId || payload.sub;
          (req as any).user = {
            userId,
            agencyId: payload.agencyId,
            adminId: payload.adminId,
            email: payload.email,
            role: payload.role || payload.accountType,
            clientId: payload.clientId,
            isAdmin: !!payload.adminId || payload.role === 'admin' || payload.role === 'sub-admin' || payload.role === 'super_admin',
            isAgency: !!payload.agencyId || payload.accountType === 'agency',
          };
          return true;
        }

        const fallbackUserId = token || 'test-user';
        this.logger.debug('Token is not JWT formatted but SKIP_JWT_VERIFICATION is enabled — using fallback userId');
        (req as any).user = {
          userId: fallbackUserId,
          agencyId: null,
          adminId: null,
          email: null,
          role: 'tester',
          clientId: null,
          isAdmin: false,
          isAgency: false,
        };
        return true;
      } catch (e) {
        this.logger.error(`Failed to decode token without verification: ${e.message}`);
        throw new UnauthorizedException('Invalid token format');
      }
    }
    
    try {
      let payload: UserTokenPayload;

      let decoded: UserTokenPayload;
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          try {
            const header = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
            this.logger.debug(`Token key ID (kid): ${header.kid}, Algorithm: ${header.alg}`);
          } catch (e) {
            // Ignore header decode errors
          }
        }
        
        decoded = verify(token, this.publicKey, {
          algorithms: ['RS256'],
          ignoreExpiration: false,
        }) as UserTokenPayload;
      } catch (verifyError: any) {
        this.logger.error(`Token signature verification failed: ${verifyError.message}`);
        this.logger.error(`Error name: ${verifyError.name}`);
        this.logger.error(`Public key length: ${this.publicKey.length}, Has newlines: ${this.publicKey.includes('\n')}`);
        throw verifyError;
      }

      const tokenIssuer = decoded.iss || '';
      const allowedIssuers = [
        this.issuer,
        'http://sso:3001/sso',
        'http://sso-service:3001/sso',
        'http://localhost:3001/sso',
        tokenIssuer.replace('localhost', 'sso'),
        tokenIssuer.replace('sso', 'localhost'),
        tokenIssuer.replace('sso-service', 'sso'),
        tokenIssuer.replace('sso', 'sso-service'),
      ];

      if (!tokenIssuer.includes('sso') && !allowedIssuers.includes(tokenIssuer)) {
        this.logger.warn(
          `Token issuer mismatch. Expected SSO issuer but got '${tokenIssuer}'. Allowed: ${allowedIssuers.join(', ')}`
        );
        if (!tokenIssuer.includes('sso') && !tokenIssuer.includes('3001')) {
          throw new UnauthorizedException(`Invalid token issuer: ${tokenIssuer}`);
        }
      }

      payload = decoded;

      if (!payload || (!payload.userId && !payload.adminId && !payload.agencyId && !payload.sub)) {
        this.logger.warn('Token missing required fields');
        throw new UnauthorizedException('Invalid token payload');
      }

      const userId = payload.userId || payload.agencyId || payload.adminId || payload.sub;

      (req as any).user = {
        userId,
        agencyId: payload.agencyId,
        adminId: payload.adminId,
        email: payload.email,
        role: payload.role || payload.accountType,
        clientId: payload.clientId,
        isAdmin: !!payload.adminId || payload.role === 'admin' || payload.role === 'sub-admin' || payload.role === 'super_admin',
        isAgency: !!payload.agencyId || payload.accountType === 'agency',
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error(`Token verification failed: ${error.message}`);
      this.logger.debug(`Public key configured: ${this.publicKey ? 'Yes' : 'No'}`);
      this.logger.debug(`Expected issuer: ${this.issuer}`);
      
      if (error.message.includes('signature') || error.message.includes('invalid signature')) {
        throw new UnauthorizedException(
          'Invalid token signature. Please verify SSO_PUBLIC_KEY matches the SSO service public key.'
        );
      }
      
      throw new UnauthorizedException(`Invalid or expired token: ${error.message}`);
    }
  }
}
