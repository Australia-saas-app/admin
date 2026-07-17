import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "../services/jwt.service";

@Injectable()
export class PlatformAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    const payload = this.jwtService.verifyAdminToken(token);
    
    if (!payload) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const validRoles = ["admin", "sub_admin", "super_admin"];
    if (!validRoles.includes(payload.role)) {
      throw new ForbiddenException("Admin privileges required");
    }

    (request as any).admin = {
      adminId: payload.adminId,
      email: payload.email,
      role: payload.role,
    };

    return true;
  }
}
