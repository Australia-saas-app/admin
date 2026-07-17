# Construction Service

NestJS microservice for managing construction services and categories.

## Port
- Default: `3011`
- Configure via `PORT` environment variable

## Features

### Services Management
- Create, read, update, delete construction services
- Toggle visibility (show/hide from public)
- Reorder services (up/down arrows)
- Search by title
- Pagination support

### Categories Management
- Create, read, update, delete construction categories
- Auto-create categories when service is created
- Prevent deletion if category is in use

## API Endpoints

### Public Routes

#### Services
- `GET /api/construction/services` - List all visible services
- `GET /api/construction/services/:serviceId` - Get service details
- `GET /api/construction/services/categories/list` - List all active categories

#### Health
- `GET /api/construction/health` - Health check

### Admin Routes (Requires JWT Bearer Token)

#### Services
- `POST /api/construction/services` - Create service
- `GET /api/construction/services/admin/list` - List all services (including hidden)
- `GET /api/construction/services/admin/:serviceId` - Get service (any visibility)
- `PATCH /api/construction/services/:serviceId` - Update service
- `DELETE /api/construction/services/:serviceId` - Delete service
- `PATCH /api/construction/services/:serviceId/visibility` - Toggle visibility
- `PATCH /api/construction/services/:serviceId/reorder` - Reorder service

#### Categories
- `POST /api/construction/services/categories` - Create category
- `GET /api/construction/services/admin/categories/list` - List all categories
- `GET /api/construction/services/admin/categories/:categoryId` - Get category
- `PATCH /api/construction/services/categories/:categoryId` - Update category
- `DELETE /api/construction/services/categories/:categoryId` - Delete category

### User/Agency Routes (Requires JWT Bearer Token)

#### Services
- `POST /api/construction/services` - Create service (User/Agency/Business)
- `POST /api/construction/services/user` - Create service (User only)
- `POST /api/construction/services/agent` - Create service (Agent/Agency only)
- `PATCH /api/construction/services/user/:serviceId` - Update service (User owns service)
- `PATCH /api/construction/services/agent/:serviceId` - Update service (Agent/Agency owns service)
- `DELETE /api/construction/services/user/:serviceId` - Delete service (User owns service)
- `DELETE /api/construction/services/agent/:serviceId` - Delete service (Agent/Agency owns service)

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
- `http://localhost:3011/api/construction/docs`

## Database

The service uses PostgreSQL and requires the following tables:
- `construction_services` - Stores construction service data
- `construction_categories` - Stores construction category data

Tables are automatically created when `NODE_ENV=development` (synchronize: true).

## Authentication

This service integrates with the SSO service for authentication:
- User/Agency tokens: For creating and managing own services
- Admin tokens: For full administrative access

Get tokens from the SSO service:
- User/Agency: `POST http://localhost:3001/auth/login`
- Admin: `POST http://localhost:3001/auth/admin/login`

## Service Structure

```
construction-service/
├── src/
│   ├── construction/
│   │   ├── entities/
│   │   │   ├── construction-service.entity.ts
│   │   │   └── construction-category.entity.ts
│   │   ├── dto/
│   │   │   ├── create-service.dto.ts
│   │   │   ├── update-service.dto.ts
│   │   │   ├── create-category.dto.ts
│   │   │   ├── update-category.dto.ts
│   │   │   └── query-params.dto.ts
│   │   ├── services/
│   │   │   ├── construction-service.service.ts
│   │   │   └── construction-category.service.ts
│   │   ├── construction.controller.ts
│   │   └── construction.module.ts
│   ├── common/
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── admin-auth.guard.ts
│   │   └── interfaces/
│   │       └── request.interface.ts
│   ├── health/
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Notes

- Service IDs are auto-generated with prefix `CONST-`
- Category IDs are auto-generated with prefix `CONST-CAT-`
- Service type is always `construction`
- Categories are automatically created when referenced in service creation
- Categories cannot be deleted if they have associated services


