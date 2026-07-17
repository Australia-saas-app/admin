import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AffiliateAuthGuard extends JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // First, run JWT validation
    const isAuthenticated = super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const accountType = request.user?.accountType;

    // Allow only affiliate accounts
    if (accountType !== 'affiliate') {
      throw new ForbiddenException('Access denied. Affiliate account required.');
    }

    return true;
  }
}