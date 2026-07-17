# Quick Start Guide

## What Changed?

✅ **Database**: Migrated from MySQL to **PostgreSQL**
✅ **Docker Compose**: Updated to use PostgreSQL instead of MongoDB
✅ **Kong**: No changes needed (already uses PostgreSQL)
✅ **Health Check**: Added `/health` endpoint

## Quick Test (3 Steps)

### Step 1: Start Services

**Option A: Using Docker Compose (Easiest)**
```bash
# From project root
docker-compose up -d
```

**Option B: Local Development**
```bash
# 1. Start PostgreSQL and Redis manually or via Docker
# 2. Update backend/.env with your credentials
# 3. Install dependencies
cd backend
npm install

# 4. Run in development mode
npm run start:dev
```

### Step 2: Check Health

```bash
# Test health endpoint
curl http://localhost:3000/health
```

Expected response:
```json
{
  "service": "vero2-backend",
  "status": "healthy",
  "timestamp": "2024-...",
  "components": {
    "database": { "status": "connected", "type": "postgresql" },
    "redis": { "status": "connected" }
  }
}
```

### Step 3: Test Registration

```bash
curl -X POST http://localhost:3000/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "accountType": "user"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully. Please verify OTP.",
  "data": {
    "userId": "USER000001",
    "accountType": "user",
    "email": "john@example.com",
    "status": "active"
  }
}
```

## Common Commands

```bash
# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Restart backend only
docker-compose restart backend

# Access PostgreSQL
docker exec -it vero2-postgres psql -U postgres -d vero2

# View database tables
docker exec -it vero2-postgres psql -U postgres -d vero2 -c "\dt"
```

## Troubleshooting

### Port 5432 already in use?
- Stop your local PostgreSQL or change the port in `docker-compose.yml`

### Backend won't start?
- Check PostgreSQL is running: `docker-compose ps postgres`
- Check logs: `docker-compose logs backend`
- Verify `.env` file exists and has correct DB credentials

### Database connection error?
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Wait a few seconds after starting for DB to initialize
- Check environment variables match docker-compose.yml

For more details, see `SETUP-AND-TEST.md`

