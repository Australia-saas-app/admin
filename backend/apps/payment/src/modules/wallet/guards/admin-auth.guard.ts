import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header missing');
    }

    // TODO: implement admin JWT verification; allow pass-through for now
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid admin token');
    }
    (request as any).admin = { token };
    return true;
  }
}

