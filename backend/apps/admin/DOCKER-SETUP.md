# Admin Service Docker Setup Guide

This guide will help you set up and run the Admin Service using Docker for testing with Postman.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- Postman (for API testing)

## Quick Start

### 1. Create Environment File

Copy the example environment file:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file and update the following if needed:

```env
# For testing, default values work fine
ADMIN_PORT=3007
NODE_ENV=development

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vero2_admin

MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DB_NAME=vero2

ADMIN_BOOTSTRAP_SECRET=change-me-bootstrap
```

**Note**: For JWT authentication, you'll need SSO keys. For initial testing without SSO, you can leave them empty, but admin login won't work until SSO is configured.

### 3. Build and Start Services

```bash
# Build and start all services (PostgreSQL, MongoDB, Admin Service)
docker-compose up --build -d

# View logs
docker-compose logs -f admin-service

# Check service status
docker-compose ps
```

### 4. Verify Services are Running

```bash
# Check health endpoint
curl http://localhost:3007/admin-service/health

# Or open in browser
# http://localhost:3007/admin-service/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Testing with Postman

### 1. Import Postman Collection

1. Open Postman
2. Click **Import**
3. Select `Admin-Service.postman_collection.json`
4. Collection will be imported with base URL: `http://localhost:3007/admin-service`

### 2. Create Initial Admin Account

**Request**: `POST /auth/admin/register`

```json
{
  "email": "admin@example.com",
  "password": "AdminSecret123!",
  "fullName": "Super Admin",
  "role": "super_admin",
  "bootstrapSecret": "change-me-bootstrap"
}
```

**Note**: Update `bootstrapSecret` in Postman variables if you changed it in `.env`.

### 3. Login to Get Token

**Request**: `POST /auth/admin/login`

```json
{
  "email": "admin@example.com",
  "password": "AdminSecret123!"
}
```

The response will automatically save the token to Postman collection variable `{{token}}`.

### 4. Test Blog Routes

Now you can test all blog routes:

1. **List Blogs**: `GET /menu/blogs?page=1&limit=10`
2. **Create Blog**: `POST /menu/blogs`
3. **Update Blog**: `PATCH /menu/blogs/:blogId`
4. **Delete Blog**: `DELETE /menu/blogs/:blogId`
5. **Toggle Visibility**: `PATCH /menu/blogs/:blogId/visibility`
6. **Reorder Blogs**: `POST /menu/blogs/reorder`

## Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Clean Start)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Admin service only
docker-compose logs -f admin-service

# Last 100 lines
docker-compose logs --tail=100 admin-service
```

### Rebuild Service
```bash
# Rebuild after code changes
docker-compose up --build -d admin-service
```

### Access Database Shells

**PostgreSQL**:
```bash
docker-compose exec postgres psql -U postgres -d vero2_admin
```

**MongoDB**:
```bash
docker-compose exec mongo mongosh -u admin -p admin123 --authenticationDatabase admin
```

### Check Service Health
```bash
# Admin Service
curl http://localhost:3007/admin-service/health

# PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# MongoDB
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

## API Documentation

Once the service is running, access Swagger documentation at:

**http://localhost:3007/admin-service/docs**

## Troubleshooting

### Service Won't Start

1. **Check logs**:
   ```bash
   docker-compose logs admin-service
   ```

2. **Verify ports are available**:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3007
   netstat -ano | findstr :5432
   netstat -ano | findstr :27017
   ```

3. **Check database connections**:
   - Ensure PostgreSQL and MongoDB are healthy
   - Verify environment variables in `.env`

### Database Connection Issues

1. **PostgreSQL**:
   - Check if container is running: `docker-compose ps`
   - Verify credentials in `.env` match docker-compose.yml
   - Check logs: `docker-compose logs postgres`

2. **MongoDB**:
   - Verify MongoDB URI format in `.env`
   - Check authentication: `docker-compose exec mongo mongosh -u admin -p admin123`

### Blog Routes Not Working

1. **Check MongoDB connection**:
   - Verify MongoDB is running: `docker-compose ps mongo`
   - Check MongoDB logs: `docker-compose logs mongo`

2. **Verify Blog entity is registered**:
   - Check `src/app.module.ts` includes Blog schema
   - Rebuild service: `docker-compose up --build -d admin-service`

3. **Check authentication**:
   - Ensure you have a valid admin token
   - Verify token in Postman: `{{token}}` variable

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove images (optional)
docker-compose down --rmi all

# Start fresh
docker-compose up --build -d
```

## Environment Variables Reference

| Variable | Default | Description |
|---------|---------|-------------|
| `ADMIN_PORT` | `3007` | Admin service port |
| `NODE_ENV` | `development` | Node environment |
| `POSTGRES_USER` | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `postgres` | PostgreSQL password |
| `POSTGRES_DB` | `vero2_admin` | PostgreSQL database name |
| `MONGO_ROOT_USERNAME` | `admin` | MongoDB root username |
| `MONGO_ROOT_PASSWORD` | `admin123` | MongoDB root password |
| `MONGO_DB_NAME` | `vero2` | MongoDB database name |
| `RATE_LIMIT_TTL` | `60` | Rate limit time window (seconds) |
| `RATE_LIMIT_MAX` | `500` | Max requests per window |
| `ADMIN_BOOTSTRAP_SECRET` | `change-me-bootstrap` | Secret for initial admin creation |
| `SSO_PUBLIC_KEY` | - | SSO public key for JWT verification |
| `SSO_PRIVATE_KEY` | - | SSO private key |
| `SSO_ISSUER` | `http://localhost:3001/sso` | SSO issuer URL |

## Next Steps

1. ✅ Services running
2. ✅ Health check passing
3. ✅ Admin account created
4. ✅ Token obtained
5. ✅ Test blog routes in Postman

## Support

- **API Docs**: http://localhost:3007/admin-service/docs
- **Health Check**: http://localhost:3007/admin-service/health
- **Logs**: `docker-compose logs -f admin-service`

