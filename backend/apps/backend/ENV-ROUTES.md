# Environment
- PORT=3000
- MONGODB_URI=mongodb://localhost:27017/vero2
- REDIS_HOST=localhost
- REDIS_PORT=6379

# Routes (auth handled by SSO service)
- Base: `http://localhost:3001/sso`
- POST `/sso/auth/user/register`
- POST `/sso/auth/user/verify-otp`
- POST `/sso/auth/user/login`
- POST `/sso/auth/user/forgot-password`
- POST `/sso/auth/user/reset-password`
- POST `/sso/auth/user/complete-profile`
- GET  `/sso/auth/me`
- POST `/sso/auth/send-otp`
- POST `/sso/auth/admin/create`
- POST `/sso/auth/admin/login`
- GET  `/sso/auth/admin/users`
- GET  `/sso/auth/admin/users/:userId`
- PATCH `/sso/auth/admin/users/:userId/status`
- POST `/sso/token` (password + refresh grants)

