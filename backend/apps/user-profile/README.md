# User Profile Service

NestJS microservice for managing user profiles, preferences, verification, and activity tracking.

## Features

- **Profile Management**: View and update user profiles
- **Profile Verification**: Identity verification with document upload
- **Contact Management**: Manage up to 3 email/phone contacts with OTP verification
- **Preferences**: User settings, notifications, theme, language, currency
- **Activity Tracking**: Log and retrieve user activity history
- **Two-Factor Authentication**: Enable/disable 2FA with email or phone

## Port

- Default: `3005`
- Environment variable: `PORT`

## API Endpoints

### Profile
- `GET /user-profile-service/profile` - Get user profile
- `PATCH /user-profile-service/profile` - Update profile
- `POST /user-profile-service/profile/verify` - Verify profile with identity proof
- `PATCH /user-profile-service/profile/photo` - Update profile photo
- `GET /user-profile-service/profile/contacts` - Get contacts
- `POST /user-profile-service/profile/contacts` - Add contact
- `PATCH /user-profile-service/profile/contacts/primary` - Change primary contact
- `DELETE /user-profile-service/profile/contacts/:contactId` - Delete contact

### Preferences
- `GET /user-profile-service/preferences` - Get preferences
- `PATCH /user-profile-service/preferences` - Update preferences

### Activity
- `GET /user-profile-service/activity` - Get activity logs

## Environment Variables

```env
PORT=3005
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_NAME=vero2

# MongoDB
MONGODB_URI=mongodb://localhost:27017/vero2
MONGODB_DB_NAME=vero2

# SSO Service
SSO_PUBLIC_KEY=
SSO_PORT=3001
SSO_URL=http://localhost:3001
SSO_ISSUER=http://localhost:3001/sso

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## Installation

```bash
npm install
```

## Development

```bash
npm run start:dev
```

## Build

```bash
npm run build
npm run start:prod
```

## Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## API Documentation

Swagger documentation available at:
- `http://localhost:3005/user-profile-service/docs`

## Health Check

- `http://localhost:3005/user-profile-service/health`

