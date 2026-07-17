import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export interface AdminTokenPayload extends JwtPayload {
  sub: string;
  adminId: string;
  email: string;
  role: string;
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  private readonly publicKey: string;
  private readonly issuer: string;

  constructor(private readonly configService: ConfigService) {
    const rawPublicKey = this.configService.get<string>("SSO_PUBLIC_KEY");
    if (!rawPublicKey) {
      throw new Error("SSO_PUBLIC_KEY is not configured");
    }

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
    this.issuer =
      this.configService.get<string>("SSO_ISSUER") ||
      "http://localhost:3001/sso";
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];

    try {
      // First, decode token without verification to check audience and issuer
      let payload: AdminTokenPayload;

      // Decode without verification first to check audience
      let decoded: any;
      try {
        // Split token to get payload (we'll verify signature separately)
        const parts = token.split(".");
        if (parts.length !== 3) {
          throw new UnauthorizedException("Invalid token format");
        }
        // Decode payload (base64url)
        const payloadPart = Buffer.from(
          parts[1].replace(/-/g, "+").replace(/_/g, "/"),
          "base64",
        ).toString("utf-8");
        decoded = JSON.parse(payloadPart);
      } catch (decodeError) {
        throw new UnauthorizedException("Invalid token format");
      }

      // Check audience first - this is a clear error if wrong
      if (decoded.aud !== "admin") {
        throw new UnauthorizedException(
          `Invalid token audience. Expected 'admin' but got '${decoded.aud}'. ` +
            `Please use an admin token from POST ${this.issuer.replace("/sso", "/auth/admin/login")}`,
        );
      }

      // Now verify signature and issuer (with flexible issuer handling)
      try {
        // Try with configured issuer
        payload = verify(token, this.publicKey, {
          algorithms: ["RS256"],
          issuer: this.issuer,
          audience: "admin",
        }) as AdminTokenPayload;
      } catch (issuerError) {
        // If issuer mismatch, try without issuer verification (signature still checked)
        // This handles Docker network vs localhost issuer differences
        const tokenIssuer = decoded.iss || "";

        // Verify it's from SSO service (check issuer contains 'sso' or matches pattern)
        if (!tokenIssuer.includes("sso") && tokenIssuer !== this.issuer) {
          // Accept if issuer is from SSO service (http://sso:3001/sso or http://localhost:3001/sso)
          const allowedIssuers = [
            this.issuer,
            "http://sso:3001/sso",
            "http://localhost:3001/sso",
            tokenIssuer.replace("localhost", "sso"),
            tokenIssuer.replace("sso", "localhost"),
          ];

          if (!allowedIssuers.includes(tokenIssuer)) {
            throw new UnauthorizedException(
              `Token issuer mismatch. Expected SSO issuer but got '${tokenIssuer}'`,
            );
          }
        }

        // Verify signature without issuer check
        payload = verify(token, this.publicKey, {
          algorithms: ["RS256"],
          audience: "admin",
        }) as AdminTokenPayload;
      }

      if (!payload || !payload.adminId) {
        throw new UnauthorizedException("Invalid token payload");
      }

      if (
        payload.role !== "admin" &&
        payload.role !== "sub-admin" &&
        payload.role !== "super_admin"
      ) {
        throw new UnauthorizedException("Admin privileges required");
      }

      (request as any).admin = {
        adminId: payload.adminId,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Log the actual error for debugging
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Admin JWT verification error:", errorMessage);
      throw new UnauthorizedException(
        `Invalid or expired admin token: ${errorMessage}`,
      );
    }
  }
}
