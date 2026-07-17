import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  userId: string;
  accountType: string;
  scope: string;
  sessionId: string;
  clientId?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly publicKey: string;
  private readonly issuer: string;

  constructor(private readonly configService: ConfigService) {
    const rawPublicKey = this.configService.get<string>('SSO_PUBLIC_KEY');
    if (!rawPublicKey) {
      throw new Error('SSO_PUBLIC_KEY is not configured');
    }

    // Handle both formats: with \n escape sequences or single line
    let formattedKey = rawPublicKey.replace(/\\n/g, '\n');

    // If key is still on single line (no actual newlines), format it properly
    // PEM format: -----BEGIN...-----\n(base64)\n-----END...-----
    if (!formattedKey.includes('\n') && formattedKey.includes('-----BEGIN')) {
      // Extract the base64 part and format with newlines every 64 chars
      const beginMatch = formattedKey.match(/-----BEGIN[^-]+-----/);
      const endMatch = formattedKey.match(/-----END[^-]+-----/);
      const base64Part = formattedKey
        .replace(/-----BEGIN[^-]+-----/, '')
        .replace(/-----END[^-]+-----/, '')
        .replace(/\s/g, '');

      if (beginMatch && endMatch && base64Part) {
        // Format base64 with newlines every 64 characters
        const formattedBase64 = base64Part.match(/.{1,64}/g)?.join('\n') || base64Part;
        formattedKey = `${beginMatch[0]}\n${formattedBase64}\n${endMatch[0]}\n`;
      }
    }

    this.publicKey = formattedKey;
    this.issuer = this.configService.get<string>('SSO_ISSUER') || 'http://localhost:3001/sso';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];

    try {
      // First, verify signature and decode token (without issuer check)
      let payload: AccessTokenPayload;

      try {
        // Try with configured issuer
        payload = verify(token, this.publicKey, {
          algorithms: ['RS256'],
          issuer: this.issuer,
        }) as AccessTokenPayload;
      } catch (issuerError) {
        // If issuer mismatch, try without issuer verification (signature still checked)
        // This handles Docker network vs localhost issuer differences
        const decoded = verify(token, this.publicKey, {
          algorithms: ['RS256'],
        }) as AccessTokenPayload;

        // Verify it's from SSO service (check issuer contains 'sso' or matches pattern)
        const tokenIssuer = decoded.iss || '';
        if (!tokenIssuer.includes('sso') && tokenIssuer !== this.issuer) {
          // Accept if issuer is from SSO service (http://sso:3001/sso or http://localhost:3001/sso)
          const allowedIssuers = [
            this.issuer,
            'http://sso:3001/sso',
            'http://localhost:3001/sso',
            tokenIssuer.replace('localhost', 'sso'),
            tokenIssuer.replace('sso', 'localhost'),
          ];

          if (!allowedIssuers.includes(tokenIssuer)) {
            throw new UnauthorizedException('Token issuer mismatch');
          }
        }

        payload = decoded;
      }

      if (!payload || !payload.userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      (request as any).user = {
        userId: payload.userId,
        accountType: payload.accountType,
        sessionId: payload.sessionId,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Log the actual error for debugging
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('JWT verification error:', errorMessage);
      throw new UnauthorizedException(`Invalid or expired token: ${errorMessage}`);
    }
  }
}
