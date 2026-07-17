# Order Service

NestJS microservice responsible for ingesting, tracking, and auditing every order that flows through the Enterprise Multi-Service Platform (technology, construction, real-estate, visa & travel, solutions, etc.).

## Port
- Default: `3003`
- Configure via `PORT` environment variable

## Core Capabilities

### Multi-Vertical Order Capture
- Unified DTOs for technology, construction, real-estate, import/export, visa/travel, education, healthcare, marketplace, donation.
- Rich client profile (KYC), flexible order details JSON, support for attachments at creation time.
- Automatic `ORDER000001` style codes with collision safety.

### Workflow & Status Automation
- Full status pipeline: `pending → payment → waiting → working → stopped → complete → delivery` plus `refund` and `cancel`.
- Requester can edit data only in `pending`; admins enforce transitions with audit logs.
- Payment hooks update paid/due amounts and auto-promote status (payment → waiting, complete → delivery on zero due).
- Profit tracking during waiting stage, delivery file vault unlocked when order is working/complete.

### Analytics & Insights
- Built-in aggregation for counts and financial totals per status.
- Supports pagination, search, status/type filters, date ranges for both requester and admin dashboards.
- Public feed for real-estate “working/delivery” cards with `isPublic=true`.

## REST Surface

### Authenticated User / Agency (`/api/orders`)
- `POST /orders` – create new order.
- `GET /orders` – list own orders with filters + analytics.
- `GET /orders/:orderCode` – fetch single order.
- `PATCH /orders/:orderCode` – edit pending order metadata.
- `POST /orders/:orderCode/documents` – append more documents (pending/working).
- `GET /orders/public/real-estate/list` – anonymous showcase feed.

All routes require SSO JWT (`JwtAuthGuard`) except the public showcase.

### Admin (`/api/orders/admin`)
- `GET /admin/list` – master list + analytics.
- `GET /admin/:orderCode` – detailed view (with status history).
- `PATCH /admin/:orderCode` – edit pending order details.
- `PATCH /admin/:orderCode/status` – enforce status transitions with reason.
- `POST /admin/:orderCode/profit` – update profit while waiting.
- `POST /admin/:orderCode/files` – attach delivery files.
- `POST /admin/:orderCode/payments` – register payment events (updates totals & auto-status).
- `GET /admin/:orderCode/status-history` – audit trail.
- `DELETE /admin/:orderCode` – purge order (cascades history/files).

Admin routes use `AdminAuthGuard` (SSO admin JWT, `aud=admin`).

## Environment Variables

```env
# Server
PORT=3003
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2

# SSO Authentication
SSO_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----...
SSO_ISSUER=http://localhost:3001/sso

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## Getting Started

```bash
npm install
npm run start:dev
```

## Build & Run

```bash
npm run build
npm run start:prod
```

Swagger docs: `http://localhost:3003/api/orders/docs`  
Health check: `http://localhost:3003/api/orders/health`

## Database

PostgreSQL + TypeORM entities:
- `orders` – core record with JSONB sub-documents.
- `order_status_history` – immutable audit trail (CASCADE on delete).

## Authentication

- Validates RS256 JWTs emitted by SSO microservice.
- Admin guard enforces `aud=admin` and role ∈ {`admin`, `sub-admin`, `super_admin`}.

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```