# Technology Service

NestJS microservice for managing technical services and categories.

## Port
- Default: `3011`
- Configure via `PORT` environment variable

## Features

### Services Management
- Create, read, update, delete technical services
- Toggle visibility (show/hide from public)
- Reorder services (up/down arrows)
- Search by title
- Pagination support

### Categories Management
- Create, read, update, delete technical categories
- Auto-create categories when service is created
- Prevent deletion if category is in use

## API Endpoints

### Public Routes

#### Services
- `GET /api/technical/services` - List all visible services
- `GET /api/technical/services/:serviceId` - Get service details
- `GET /api/technical/services/categories/list` - List all active categories

#### Health
- `GET /api/technical/health` - Health check

### Admin Routes (Requires JWT Bearer Token)

#### Services
- `POST /api/technical/services` - Create service
- `GET /api/technical/services/admin/list` - List all services (including hidden)
- `GET /api/technical/services/admin/:serviceId` - Get service (any visibility)
- `PATCH /api/technical/services/:serviceId` - Update service
- `DELETE /api/technical/services/:serviceId` - Delete service
- `PATCH /api/technical/services/:serviceId/visibility` - Toggle visibility
- `PATCH /api/technical/services/:serviceId/reorder` - Reorder service

#### Categories
- `POST /api/technical/services/categories` - Create category
- `GET /api/technical/services/admin/categories/list` - List all categories
- `GET /api/technical/services/admin/categories/:categoryId` - Get category
- `PATCH /api/technical/services/categories/:categoryId` - Update category
- `DELETE /api/technical/services/categories/:categoryId` - Delete category

## Environment Variables

```env
# Server
PORT=3011
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2

# SSO Authentication
SSO_PUBLIC_KEY=your_sso_public_key
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

## API Documentation

Swagger documentation available at:
- `http://localhost:3011/api/technical/docs`

## Database

Uses PostgreSQL with TypeORM. Entities:
- `technical_services` - Services table
- `technical_categories` - Categories table

## Authentication

This service authenticates via SSO Service (Port 3001):
- JWT tokens signed with RS256
- Verify tokens using `SSO_PUBLIC_KEY`
- Admin routes require admin/sub-admin role

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```




