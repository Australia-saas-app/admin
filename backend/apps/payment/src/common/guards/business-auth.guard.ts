import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class BusinessAuthGuard extends JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // First, run JWT validation
    const isAuthenticated = super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const accountType = request.user?.accountType;

    // Allow business or agency accounts
    if (accountType !== 'business' && accountType !== 'agency') {
      throw new ForbiddenException('Access denied. Business/Agency account required.');
    }

    return true;
  }
}