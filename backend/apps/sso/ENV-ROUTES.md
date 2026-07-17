# Environment
- SSO_PORT=3001
- SSO_ISSUER=http://sso:3001/sso
- ACCESS_TOKEN_TTL=900
- REFRESH_TOKEN_TTL=1209600
- SSO_SYNCHRONIZE=true
- SSO_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"
- SSO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----"
- SSO_DB_USER=vero2_sso_app
- SSO_DB_PASSWORD=change-me-sso
- SSO_DB_NAME=vero2_sso
- DEFAULT_CLIENT_ID/SECRET (auto-provisioned OAuth client)

# Routes
- Auth base: `http://localhost:3001/sso/auth`
  - POST `/user/register`, `/user/verify-otp`, `/user/login`, `/user/forgot-password`, `/user/reset-password`, `/user/complete-profile`
  - GET `/me`
  - POST `/send-otp`
  - POST `/admin/create`, `/admin/login`
  - GET `/admin/users`, GET `/admin/users/:userId`, PATCH `/admin/users/:userId/status`
- Token base: `http://localhost:3001/sso/token`
  - POST `/sso/token` (password and refresh grants)