# Authentication Service Routes (SSO Service)

> **Heads up:** Legacy Express authentication endpoints under `/api/auth` have been removed from the backend.  
> The SSO service now owns every authentication-related route at `/sso/auth` and issues JWTs from `/sso/token`.

---

## Base URLs

- **SSO Auth Routes:** `http://localhost:3001/sso/auth`
- **Token Endpoint:** `http://localhost:3001/sso/token`
- **JWKS / OpenID Discovery:** `http://localhost:3001/sso/.well-known/jwks.json`

All responses are JSON and tokens are signed with RS256 using the SSO key pair.

---

## 🔐 User Account Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/sso/auth/user/register` | Register user/agency/business account, triggers OTP | Public |
| POST | `/sso/auth/user/verify-otp` | Verify registration OTP | Public |
| POST | `/sso/auth/user/login` | Password grant login (delegates to `/sso/token`) | Public |
| POST | `/sso/auth/user/forgot-password` | Request password reset OTP | Public |
| POST | `/sso/auth/user/reset-password` | Reset password with OTP | Public |
| POST | `/sso/auth/user/complete-profile` | Submit extended profile info for review | Bearer (access token) |
| GET | `/sso/auth/me` | Fetch current user summary | Bearer (access token) |

---

## 📲 OTP Utility

| Method | Path | Description |
|--------|------|-------------|
| POST | `/sso/auth/send-otp` | Send OTP for registration, login 2FA, or password reset (type defaults to `login`) |

---

## 👤 Admin Authentication & Management

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/sso/auth/admin/create` | Create a new admin or sub-admin | Public (bootstrap) |
| POST | `/sso/auth/admin/login` | Issue RS256 admin access token | Public |
| GET | `/sso/auth/admin/users` | Paginated user listing with filters/search | Bearer (admin token) |
| GET | `/sso/auth/admin/users/:userId` | Fetch full profile for a single user | Bearer (admin token) |
| PATCH | `/sso/auth/admin/users/:userId/status` | Update user status + append history | Bearer (admin token) |

Admin tokens carry `aud=admin` and must be supplied as `Authorization: Bearer <token>`.

---

## 🎫 Token Issuance (OAuth 2.0 Password & Refresh Grants)

- **POST** `/sso/token`
  - `grant_type=password` → issues access/refresh tokens, handles MFA via OTP.
  - `grant_type=refresh_token` → rotates refresh tokens and issues new access token.
- Default client auto-provisions from `DEFAULT_CLIENT_ID/SECRET` env vars.
- Response payload mirrors OAuth 2.0 conventions (`access_token`, `refresh_token`, `expires_in`, `token_type`, `scope`, plus user/session snapshot).

---

## 🔑 Middleware Consumers

- **Backend services** must validate tokens using `SSO_PUBLIC_KEY` (RS256).  
  Admin-facing routes should require the admin audience.
- **Frontends** should call the SSO service directly for auth flows and reuse issued tokens against downstream APIs.

---

## ✅ Status Reference

- `200` success, `201` created, `400/401/403` for validation/auth failures, `409` conflicts, `500` for server errors.
- MFA flows surface `error: "mfa_required"` with `requires2FA: true` so clients can prompt for OTP.

---

For validator/request shapes, inspect the DTOs under `sso/src/modules/auth/dto`. The SSO service is built with NestJS, TypeORM (Postgres), Redis for OTP storage, and shares entities with the backend domain model.


