import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../../../../common/services/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    let payload: any = this.jwtService.verifyAccessToken(token);

    if (!payload) {
      // Try verifying as admin token
      payload = this.jwtService.verifyAdminToken(token);
      console.log('Admin token payload:', payload);
    }

    if (!payload) {
      console.log('No valid payload found');
      throw new UnauthorizedException('Invalid or expired token');
    }

    (request as any).user = payload;
    return true;
  }
}


