import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const admin = (request as any).admin;

    if (!admin) {
      throw new ForbiddenException('Admin authentication required');
    }

    if (admin.role !== 'super_admin' && admin.role !== 'admin') {
      throw new ForbiddenException('Super admin or main admin privileges required');
    }

    return true;
  }
}




