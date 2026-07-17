import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { verify, decode, JwtPayload } from "jsonwebtoken";

/**
 * JWT Token Payload from SSO Service or Admin Service
 */
export interface UserTokenPayload extends JwtPayload {
  userId?: string; // User tokens from SSO service
  adminId?: string; // Admin tokens from Admin service
  sub: string;
  email?: string;
  role?: string;
  accountType?: string;
  clientId?: string;
}
export interface AdminTokenPayload extends JwtPayload {
  sub: string;
  adminId: string;
  email: string;
  role: string;
}
/**
 * JWT Authentication Guard
 *
 * Verifies JWT tokens from SSO Service using RS256 algorithm.
 *
 * Design Decision:
 * - Only stores ownerId (string) in file records
 * - Does NOT store full user details (name, email, etc.)
 * - User details should be fetched from User Profile Service when needed
 * - This follows microservices principle: single source of truth
 */
@Injectable()
export class SimpleAuthGuard implements CanActivate {
  private readonly publicKey: string;
  private readonly issuer: string;
  private readonly logger = new Logger(SimpleAuthGuard.name);

  constructor(private readonly configService: ConfigService) {
    const rawPublicKey = this.configService.get<string>("SSO_PUBLIC_KEY");

    if (!rawPublicKey) {
      this.logger.warn(
        "SSO_PUBLIC_KEY not configured. JWT verification disabled. " +
          "Set SSO_PUBLIC_KEY environment variable to enable real JWT verification.",
      );
      // Allow service to start but log warning
      this.publicKey = "";
    } else {
      // Handle both formats: with \n escape sequences or single line
      let formattedKey = rawPublicKey.replace(/\\n/g, "\n");

      // If key is still on single line (no actual newlines), format it properly
      // PEM format: -----BEGIN...-----\n(base64)\n-----END...-----
      if (!formattedKey.includes("\n") && formattedKey.includes("-----BEGIN")) {
        // Extract the base64 part and format with newlines every 64 chars
        const beginMatch = formattedKey.match(/-----BEGIN[^-]+-----/);
        const endMatch = formattedKey.match(/-----END[^-]+-----/);
        const base64Part = formattedKey
          .replace(/-----BEGIN[^-]+-----/, "")
          .replace(/-----END[^-]+-----/, "")
          .replace(/\s/g, "");

        if (beginMatch && endMatch && base64Part) {
          // Format base64 with newlines every 64 characters
          const formattedBase64 =
            base64Part.match(/.{1,64}/g)?.join("\n") || base64Part;
          formattedKey = `${beginMatch[0]}\n${formattedBase64}\n${endMatch[0]}\n`;
        }
      }

      this.publicKey = formattedKey;
    }

    this.issuer = this.configService.get<string>(
      "SSO_ISSUER",
      "http://localhost:3001/sso",
    );
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // Allow health endpoint without authentication
    if (
      req.url &&
      (req.url.includes("/health") || req.url.endsWith("/health"))
    ) {
      return true;
    }

    // Allow public share access without authentication
    if (req.url && req.url.includes("/share/")) {
      return true;
    }

    const auth = req.headers["authorization"];

    // Check if we should skip JWT verification
    const skipVerify =
      this.configService.get<string>("SKIP_JWT_VERIFICATION") ||
      this.configService.get<boolean>("SKIP_JWT_VERIFICATION");
    if (
      skipVerify === true ||
      (typeof skipVerify === "string" && skipVerify.toLowerCase() === "true")
    ) {
      // When skipping verification, allow request if no auth header OR valid auth
      if (!auth || !auth.toString().toLowerCase().startsWith("bearer ")) {
        // No auth header - assign a test user
        (req as any).user = { userId: "test-user", isAdmin: false };
        (req as any).ownerId = "test-user";
        return true;
      }
      // Has auth header - decode without verification
      try {
        const token = auth.split(" ")[1] || "";
        const decoded = decode(token) as UserTokenPayload | null;
        if (decoded) {
          const userId = (decoded as any).userId || (decoded as any).adminId || decoded.sub;
          (req as any).user = { userId, isAdmin: !!(decoded as any).adminId };
          (req as any).ownerId = userId;
        } else {
          (req as any).user = { userId: "test-user", isAdmin: false };
          (req as any).ownerId = "test-user";
        }
        return true;
      } catch {
        (req as any).user = { userId: "test-user", isAdmin: false };
        (req as any).ownerId = "test-user";
        return true;
      }
    }

    if (!auth || !auth.toString().toLowerCase().startsWith("bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    // If public key not configured, allow any token (backward compatibility for development)
    if (!this.publicKey) {
      this.logger.debug(
        "SSO_PUBLIC_KEY not configured. Accepting token without verification.",
      );
      return true;
    }

    const token = auth.split(" ")[1];
    
    try {
      // Verify JWT token with RS256 algorithm
      let payload: UserTokenPayload;

      try {
        // Try with configured issuer
        payload = verify(token, this.publicKey, {
          algorithms: ["RS256"],
          issuer: this.issuer,
        }) as UserTokenPayload;
      } catch {
        // If issuer mismatch, try without issuer verification (signature still checked)
        // This handles Docker network vs localhost issuer differences
       payload = verify(token, this.publicKey, {
          algorithms: ["RS256"],
          issuer: this.issuer,
          audience: "admin",
        }) as AdminTokenPayload;
        if (!payload.adminId || !payload.email || !payload.role) {
          Logger.warn("Admin token missing required fields");
          return null;
        }
      }

      // Verify required fields (support both user and admin tokens)
      if (!payload || (!payload.userId && !payload.adminId && !payload.sub)) {
        this.logger.warn(
          "Token missing required fields (userId, adminId, or sub)",
        );
        throw new UnauthorizedException("Invalid token payload");
      }

      // Extract userId from token (support user tokens: userId, admin tokens: adminId, fallback: sub)
      const userId = payload.userId || payload.adminId || payload.sub;

      // Attach user info to request for use in controllers
      (req as any).user = {
        userId,
        adminId: payload.adminId, // For admin tokens
        email: payload.email,
        role: payload.role || payload.accountType,
        clientId: payload.clientId,
        isAdmin:
          !!payload.adminId ||
          payload.role === "admin" ||
          payload.role === "sub-admin" ||
          payload.role === "super_admin",
      };

      // Store ownerId in request (for file ownership validation)
      (req as any).ownerId = userId;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.debug(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException(
        `Invalid or expired token: ${error.message}`,
      );
    }
  }
}
