# Commercial & Industrial Service

NestJS microservice for managing commercial & industrial offerings and categories.

## Port
- Default: `3021`
- Configure via `PORT` environment variable

## Features

### Services Management
- Create, read, update, delete commercial/industrial services
- Toggle visibility (show/hide from public)
- Reorder services (up/down arrows)
- Search by title
- Pagination support

### Categories Management
- Create, read, update, delete commercial/industrial categories
- Auto-create categories when service is created
- Prevent deletion if category is in use

## API Endpoints

### Public Routes

#### Services
- `GET /api/commercial-industrial/services` - List all visible services
- `GET /api/commercial-industrial/services/:serviceId` - Get service details
- `GET /api/commercial-industrial/services/categories/list` - List all active categories

#### Health
- `GET /api/commercial-industrial/health` - Health check

### Admin Routes (Requires JWT Bearer Token)

#### Services
- `POST /api/commercial-industrial/services` - Create service
- `GET /api/commercial-industrial/services/admin/list` - List all services (including hidden)
- `GET /api/commercial-industrial/services/admin/:serviceId` - Get service (any visibility)
- `PATCH /api/commercial-industrial/services/:serviceId` - Update service
- `DELETE /api/commercial-industrial/services/:serviceId` - Delete service
- `PATCH /api/commercial-industrial/services/:serviceId/visibility` - Toggle visibility
- `PATCH /api/commercial-industrial/services/:serviceId/reorder` - Reorder service

#### Categories
- `POST /api/commercial-industrial/services/categories` - Create category
- `GET /api/commercial-industrial/services/admin/categories/list` - List all categories
- `GET /api/commercial-industrial/services/admin/categories/:categoryId` - Get category
- `PATCH /api/commercial-industrial/services/categories/:categoryId` - Update category
- `DELETE /api/commercial-industrial/services/categories/:categoryId` - Delete category

## Environment Variables

```env
# Server
PORT=3021
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
- `http://localhost:3021/api/commercial-industrial/docs`

## Database

Uses PostgreSQL with TypeORM. Entities:
- `commercial_industrial_services` - Services table
- `commercial_industrial_categories` - Categories table

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




