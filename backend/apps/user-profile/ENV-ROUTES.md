# Environment
- PORT=3005
- NODE_ENV=production
- DB_HOST=postgres
- DB_PORT=5432
- DB_USERNAME=postgres
- DB_PASSWORD=your_password
- DB_NAME=vero2
- MONGODB_URI=mongodb://vero2_mongo_app:change-me-mongo-app@mongo:27017/vero2?authSource=admin
- MONGODB_DB_NAME=vero2
- SSO_PUBLIC_KEY=your_sso_public_key_here
- SSO_PORT=3001
- SSO_URL=http://sso:3001
- SSO_ISSUER=http://sso:3001/sso
- RATE_LIMIT_TTL=60
- RATE_LIMIT_MAX=100
- PROFILE_UPDATE_COOLDOWN_DAYS=30

# Routes
- Base: `/user-profile-service`
- Health: GET `/health`
- Profile (JWT):
  - GET `/profile`
  - PATCH `/profile`
  - POST `/profile/verify`
  - PATCH `/profile/photo`
  - GET `/profile/contacts`
  - POST `/profile/contacts`
  - PATCH `/profile/contacts/primary`
  - DELETE `/profile/contacts/:contactId`
- Preferences (JWT):
  - GET `/preferences`
  - PATCH `/preferences`
- Activity (JWT):
  - GET `/activity` (query: pagination/filters in `ActivityQueryDto`)

