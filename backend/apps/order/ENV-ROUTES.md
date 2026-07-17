# Environment
- PORT=3003
- NODE_ENV=production
- DB_HOST=host.docker.internal
- DB_PORT=5432
- DB_USERNAME=postgres
- DB_PASSWORD=your_password
- DB_NAME=vero2
- SSO_PUBLIC_KEY=your_sso_public_key_here
- SSO_ISSUER=http://localhost:3001/sso
- RATE_LIMIT_TTL=60
- RATE_LIMIT_MAX=100

# Routes
- Base: `http://localhost:3003/api/orders`
- Public: GET `/public/real-estate/list`, GET `/health`
- User/Agency: POST `/`, GET `/`, GET `/:orderCode`, PATCH `/:orderCode`, POST `/:orderCode/documents`
- Admin: GET `/admin/list`, GET `/admin/:orderCode`, PATCH `/admin/:orderCode`, PATCH `/admin/:orderCode/status`, POST `/admin/:orderCode/profit`, POST `/admin/:orderCode/files`, POST `/admin/:orderCode/payments`, GET `/admin/:orderCode/status-history`, DELETE `/admin/:orderCode`

