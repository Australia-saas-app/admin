import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { verify, decode, JwtPayload } from "jsonwebtoken";

export interface PlatformTokenPayload extends JwtPayload {
  sub: string;
  adminId: string;
  email: string;
  role: string;
  aud?: string | string[];
  iss?: string;
}

@Injectable()
export class JwtService {
  private readonly publicKey: string;
  private readonly issuer: string;
  private readonly issuerLocal: string;
  private readonly skipVerification: boolean;

  constructor(private readonly configService: ConfigService) {
    const providedPublicKey = this.configService.get<string>("SSO_PUBLIC_KEY");

    if (!providedPublicKey) {
      throw new Error("SSO_PUBLIC_KEY is required");
    }

    // Normalize key: allow values with literal "\\n" sequences or single-line
    // wrapped in quotes. Remove surrounding quotes then replace escaped newlines.
    const stripQuotes = (v: string) => {
      const trimmed = v.trim();
      // Remove surrounding single or double quotes if present
      if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ) {
        return trimmed.slice(1, -1);
      }
      return trimmed;
    };

    this.publicKey = stripQuotes(providedPublicKey).replace(/\\n/g, "\n");

    const ssoPort = this.configService.get("SSO_PORT", 3001);
    const defaultIssuer = `http://localhost:${ssoPort}/sso`;
    this.issuer = this.configService.get<string>("SSO_ISSUER", defaultIssuer);
    this.issuerLocal = this.configService.get<string>("SSO_ISSUER_LOCAL", defaultIssuer);
    
    // Allow skipping JWT verification for development/testing
    const skipVerificationRaw = this.configService.get<string>("SKIP_JWT_VERIFICATION", "false");
    this.skipVerification = skipVerificationRaw.toLowerCase() === "true";
    
    if (this.skipVerification) {
      Logger.warn("⚠️  JWT verification is DISABLED (SKIP_JWT_VERIFICATION=true). This should only be used for testing!", JwtService.name);
    }
  }

  verifyAdminToken(token: string): PlatformTokenPayload | null {
    try {
      // Skip verification for development/testing if SKIP_JWT_VERIFICATION is set
      if (this.skipVerification) {
        Logger.warn("⚠️  Skipping JWT verification (SKIP_JWT_VERIFICATION=true)", JwtService.name);
        
        try {
          // Try to decode token without verification to extract payload
          const decoded = decode(token) as PlatformTokenPayload | null;
          
          if (decoded && decoded.adminId && decoded.email && decoded.role) {
            Logger.debug(`Token decoded without verification for admin: ${decoded.adminId}`, JwtService.name);
            return decoded;
          }
          
          // If token doesn't have required fields, still allow for testing
          Logger.warn("Token missing required fields but SKIP_JWT_VERIFICATION is enabled - allowing anyway", JwtService.name);
          return decoded as PlatformTokenPayload;
        } catch (e) {
          Logger.error(`Failed to decode token without verification: ${e.message}`, JwtService.name);
          return null;
        }
      }
      
      Logger.debug(
        `Verifying token with issuer: ${this.issuer}`,
        JwtService.name,
      );

      let payload: PlatformTokenPayload | null = null;

      try {
        // Try with configured issuer first (with expiration check)
        payload = verify(token, this.publicKey, {
          algorithms: ["RS256"],
          issuer: this.issuer,
          audience: "admin",
        }) as PlatformTokenPayload;
      } catch (issuerError: any) {
        // If it's just an expiration error, try again ignoring expiration
        if (issuerError.name === "TokenExpiredError") {
          Logger.debug(
            `Token expired, trying verification without expiration check`,
            JwtService.name,
          );

          try {
            payload = verify(token, this.publicKey, {
              algorithms: ["RS256"],
              audience: "admin",
              ignoreExpiration: true,
            }) as PlatformTokenPayload;

            // Check audience
            if (payload.aud !== "admin") {
              Logger.warn(
                `Token audience mismatch: ${payload.aud}`,
                JwtService.name,
              );
              return null;
            }
          } catch (verifyError: any) {
            Logger.error(
              `Token verification failed even without expiration check: ${verifyError.message}`,
              JwtService.name,
            );
            return null;
          }
        } else {
          // Not an expiration error, try flexible issuer check
          Logger.debug(
            `Primary issuer verification failed, trying flexible check: ${issuerError.message}`,
            JwtService.name,
          );

          // If issuer mismatch, verify without issuer check (signature still validated)
          const decoded = verify(token, this.publicKey, {
            algorithms: ["RS256"],
          }) as PlatformTokenPayload;

          // Flexible issuer check - accept any SSO-related issuers
          const tokenIssuer = decoded.iss || "";
          const allowedIssuers = [
            this.issuer,
            this.issuerLocal,
            "http://sso:3001/sso",
            "http://localhost:3001/sso",
            "http://sso-service:3001/sso",
            tokenIssuer.replace("localhost", "sso"),
            tokenIssuer.replace("sso", "localhost"),
            tokenIssuer.replace("sso-service", "localhost"),
            tokenIssuer.replace("localhost", "sso-service"),
          ];

          // Check if token issuer contains 'sso' or is in allowed list
          if (
            !tokenIssuer.includes("sso") &&
            !allowedIssuers.includes(tokenIssuer)
          ) {
            Logger.warn(
              `Token issuer mismatch: ${tokenIssuer}`,
              JwtService.name,
            );
            return null;
          }

          Logger.debug(
            `Token verified with flexible issuer: ${tokenIssuer}`,
            JwtService.name,
          );
          payload = decoded;
        }
      }

      if (!payload || (!payload.adminId || !payload.email || !payload.role)) {
        Logger.warn(
          `Admin token missing required fields. Has: adminId=${!!payload?.adminId}, email=${!!payload?.email}, role=${!!payload?.role}`,
          JwtService.name,
        );
        return null;
      }

      Logger.debug(
        `Token verified successfully for admin: ${payload.adminId}`,
        JwtService.name,
      );
      return payload;
    } catch (error) {
      Logger.error(
        `Token verification failed: ${error.message} (name: ${error.name})`,
        JwtService.name,
      );
      return null;
    }
  }
}
