# Environment
- PORT=3021
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
- Base: `http://localhost:3021/api/commercial-industrial`
- Public: GET `/services`, GET `/services/:serviceId`, GET `/services/categories/list`
- User/Agency: POST `/services`
- Admin: GET `/services/admin/list`, GET `/services/admin/:serviceId`, PATCH `/services/:serviceId`, DELETE `/services/:serviceId`, PATCH `/services/:serviceId/visibility`, PATCH `/services/:serviceId/reorder`, POST `/services/categories`, GET `/services/admin/categories/list`, GET `/services/admin/categories/:categoryId`, PATCH `/services/categories/:categoryId`, DELETE `/services/categories/:categoryId`

