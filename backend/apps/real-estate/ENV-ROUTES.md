# Environment
- PORT=3011
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
- Base prefix: `/api/real-estate`
- Health: GET `/health`
- Properties (public):
  - GET `/properties` (filters via query)
  - GET `/properties/:propertyId`
- Properties (user/agency/business JWT):
  - POST `/properties`
  - POST `/properties/user`
  - POST `/properties/agent`
  - PATCH `/properties/user/:propertyId`
  - PATCH `/properties/agent/:propertyId`
  - DELETE `/properties/user/:propertyId`
  - DELETE `/properties/agent/:propertyId`
- Properties (admin JWT):
  - GET `/properties/admin/list`
  - GET `/properties/admin/:propertyId`
  - PATCH `/properties/:propertyId`
  - DELETE `/properties/:propertyId`
  - PATCH `/properties/:propertyId/visibility`
  - PATCH `/properties/:propertyId/reorder`
- Categories:
  - Public: GET `/properties/categories/list`
  - Admin JWT: POST `/properties/categories`, GET `/properties/admin/categories/list`, GET `/properties/admin/categories/:categoryId`, PATCH `/properties/categories/:categoryId`, DELETE `/properties/categories/:categoryId`

