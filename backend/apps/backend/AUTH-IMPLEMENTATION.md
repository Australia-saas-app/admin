# Authentication Implementation (SSO Service)

The Express-based `/api/auth` stack has been retired. All authentication logic now lives inside the **SSO service** (`sso/`), built with NestJS, TypeORM, and Redis. This document captures the new structure so backend teams know where to look.

---

## 📁 Key Modules

| Area | Path | Notes |
|------|------|-------|
| Auth module | `sso/src/modules/auth/` | Controllers, services, DTOs, guards |
| Token module | `sso/src/modules/token/` | OAuth2 password & refresh grants |
| Entities | `sso/src/entities/` | Shared Postgres models (users, admins, OAuth artifacts) |
| Redis setup | `sso/src/redis/redis.module.ts` | Exposes `REDIS_CLIENT` for OTP storage |
| JWT utilities | `sso/src/common/services/jwt.service.ts` | RS256 signing + JWKS exposure |

OTP helpers (`OtpUtil`) and JWT signing are provided as injectable services so both the auth and token modules can reuse them.

---

## 🔐 High-Level Flow

1. **User registration** (`POST /sso/auth/user/register`)  
   - Normalises email/phone, validates account type, persists user with `status=pending`  
   - Sends OTP via Redis-backed helper
2. **OTP verification** (`POST /sso/auth/user/verify-otp`)  
   - Marks email/phone as verified
3. **Login** (`POST /sso/auth/user/login`)  
   - Delegates to token service (password grant)  
   - Supports TOTP-like MFA via one-time OTPs (`mfa_required` error when triggered)
4. **Token issuance** (`POST /sso/token`)  
   - Issues RS256-signed access & refresh tokens, records session metadata
5. **Admin login & management** (`/sso/auth/admin/*`)  
   - Admin tokens carry `aud=admin`; status changes append to `statusHistory`

All JWTs are signed with the SSO private key. Downstream services (e.g. `backend/`) must verify using `SSO_PUBLIC_KEY` and respect `issuer`/`audience`.

---

## 🧩 Important DTOs

Located under `sso/src/modules/auth/dto`.

- `register.dto.ts`, `login.dto.ts`, `forgot-password.dto.ts`, `reset-password.dto.ts`
- `complete-profile.dto.ts` for post-registration enrichment
- `admin-users-query.dto.ts` & `update-user-status.dto.ts` for admin dashboards

Validation is enforced by Nest’s `ValidationPipe` with automatic transformation.

---

## 🛡️ Guards & Middleware

- `JwtAuthGuard` – validates bearer tokens for end-users (access tokens)
- `AdminAuthGuard` – validates admin tokens (`aud=admin`)
- Backend services use `backend/middleware/auth.js`, updated to verify RS256 tokens via `SSO_PUBLIC_KEY`

---

## 🔄 OTP & Redis

`OtpUtil` wraps Redis `set`/`get` with TTL controls and currently logs OTPs (replace with email/SMS providers in production). Keys follow the pattern `otp:<email|phone>:<context>`.

---

## ✅ Migration Checklist

- [x] Removed Express routes (`backend/routes/auth.js`) and helper utilities  
- [x] Eliminated legacy JWT/OTP helpers under `backend/utils/`  
- [x] Updated backend middleware to verify SSO-signed tokens  
- [x] Added Nest auth module inside SSO service with parity endpoints  
- [x] Extended `User` entity with `statusHistory` for admin auditing  
- [x] Refreshed docs (`API-ROUTES.md`) pointing to new endpoints

---

## 📬 Next Steps

- Replace OTP logging with real email/SMS providers (SendGrid, Twilio, etc.)
- Add automated migrations for the new `statusHistory` JSONB column if running without `synchronize`
- Build Postman / Thunder Client collections that target `/sso/auth` and `/sso/token`
- Ensure environment variables are shared across services (`SSO_PRIVATE_KEY`, `SSO_PUBLIC_KEY`, `DEFAULT_CLIENT_ID`, etc.)

The SSO service is now the single source of truth for authentication. Treat the Express backend as an OAuth client that verifies tokens—it should no longer mint or sync identities on its own.


