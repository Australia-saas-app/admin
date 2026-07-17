# Admin Service

Admin Service (Port 3007) - NestJS microservice for admin operations, analytics, and system management.

## Overview

The Admin Service provides comprehensive administrative functionality including:

- Analytics and Dashboard
- User Management
- Admin/Sub-Admin Management
- Activity Logs and Audit Trails
- Chat Management
- Notifications
- Reports Generation
- System Settings

## Architecture

- **Framework**: NestJS (TypeScript)
- **Databases**:
  - PostgreSQL 15+ (for analytics and reporting)
  - MongoDB 7+ (for activity_logs, audit_trails, system_events)
- **Authentication**: Uses SSO Service tokens (AdminAuthGuard)
- **Port**: 3007

## Features

### Analytics & Dashboard

- Real-time statistics
- User analytics
- Order analytics
- Payment/Revenue analytics
- Data visualization support

### User Management

- List users with filters (status, account type, date range)
- View user details
- Update user status
- View user activity logs

### Admin Management

- List admins/sub-admins
- Create new admins (Super Admin only)
- Update admin details
- Delete admins (Super Admin only)
- View admin activity

### Activity Logs & Audit

- Activity logs tracking
- Audit trails
- System events logging
- Filtering and pagination

### Chat Management

- Chat topic management
- Predefined messages management
- Topic assignment to sub-admins

### Notifications

- View notifications
- Mark as read
- Filter by type, priority

### Reports

- Financial reports
- User reports
- Order reports
- Export functionality

### System Settings

- Platform configuration
- System health monitoring
- System statistics

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- MongoDB 7+
- SSO Service running (for authentication)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Server
PORT=3007
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2

# SSO Service
SSO_PORT=3001
SSO_SERVICE_URL=http://localhost:3001
SSO_PUBLIC_KEY=your_public_key_here
SSO_ISSUER=http://localhost:3001/sso

# Backend Service (for chat/notifications)
BACKEND_PORT=3000
BACKEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=500
```

### Running the Service

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

> **Logging note:** When `NODE_ENV` (or `ADMIN_NODE_ENV` in Docker) is anything other than `production`, the service enables pretty logging via `pino-pretty`. The package is now part of the runtime dependencies so containers launch cleanly. If you prefer to avoid the pretty transport, set the environment variable to `production`.

### Bootstrapping the first admin

- Set `ADMIN_BOOTSTRAP_SECRET` in your environment.
- Call `POST /admin-service/auth/admin/register` with that secret, email, password, and desired role to create the first (super) admin.
- Once at least one admin exists, either set `allowAdditional: true` in the request or use the Admin Management endpoints to add more admins.

## API Documentation

Once the service is running, access Swagger documentation at:

- `http://localhost:3007/admin-service/docs`

## Authentication

All endpoints require an admin JWT token from the SSO service. Include the token in the Authorization header:

```
Authorization: Bearer <admin_token>
```

## Endpoints

### Analytics

- `GET /admin-service/analytics/dashboard` - Dashboard analytics
- `GET /admin-service/analytics/users` - User analytics
- `GET /admin-service/analytics/orders` - Order analytics
- `GET /admin-service/analytics/payments` - Payment analytics
- `GET /admin-service/analytics/revenue` - Revenue analytics

### Users

- `GET /admin-service/users` - List users
- `GET /admin-service/users/:userId` - Get user details
- `PATCH /admin-service/users/:userId/status` - Update user status
- `GET /admin-service/users/:userId/activity` - Get user activity

### Admins

- `GET /admin-service/admins` - List admins
- `POST /admin-service/admins` - Create admin (Super Admin only)
- `PATCH /admin-service/admins/:adminId` - Update admin (Super Admin only)
- `DELETE /admin-service/admins/:adminId` - Delete admin (Super Admin only)
- `GET /admin-service/admins/:adminId/activity` - Get admin activity

### Logs

- `GET /admin-service/logs/activity` - Get activity logs
- `GET /admin-service/logs/audit` - Get audit trails
- `GET /admin-service/logs/system-events` - Get system events

### Chat

- `GET /admin-service/chat/topics` - Get chat topics
- `POST /admin-service/chat/topics` - Create chat topic
- `GET /admin-service/chat/predefined-messages` - Get predefined messages
- `POST /admin-service/chat/predefined-messages` - Create predefined message

### Notifications

- `GET /admin-service/notifications` - Get notifications
- `PATCH /admin-service/notifications/:notificationId/read` - Mark as read
- `PATCH /admin-service/notifications/read-all` - Mark all as read

### Reports

- `GET /admin-service/reports/financial` - Financial report
- `GET /admin-service/reports/users` - User report
- `GET /admin-service/reports/orders` - Order report

### Settings

- `GET /admin-service/settings` - Get system settings
- `PATCH /admin-service/settings` - Update settings (Super Admin only)
- `GET /admin-service/settings/health` - System health
- `GET /admin-service/settings/statistics` - System statistics

## Database Schema

### MongoDB Collections

#### activity_logs

- userId, adminId
- action, service
- details, ipAddress, userAgent
- timestamp

#### audit_trails

- entityType, entityId
- action, performedBy, performedByType
- oldValues, newValues
- ipAddress, metadata, timestamp

#### system_events

- eventType, severity
- service, message, data
- userId, adminId
- timestamp, resolved, resolvedAt

## Integration Points

- **SSO Service**: For admin authentication and user management
- **Backend Service**: For chat topics and notifications (legacy endpoints)
- **Other Services**: For analytics data (to be implemented)

## Security

- All endpoints protected with AdminAuthGuard
- Super Admin only endpoints protected with SuperAdminGuard
- Rate limiting: 500 requests/minute per admin
- JWT token validation using SSO public key

## Development

```bash
# Run in development mode
npm run start:dev

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## License

ISC
