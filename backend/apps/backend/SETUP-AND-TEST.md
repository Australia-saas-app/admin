# Backend Setup and Testing Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ installed (or use Docker)
- Redis 7+ installed (or use Docker)
- Docker & Docker Compose (optional, for containerized setup)

## Option 1: Local Development Setup (Without Docker)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

Create the database:

```sql
CREATE DATABASE vero2;
```

Or using psql command line:

```bash
psql -U postgres -c "CREATE DATABASE vero2;"
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2
```

### 4. Run Database Migrations (Optional)

If you have migrations:

```bash
npm run migration:run
```

### 5. Start the Application

Development mode (with auto-reload):

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000`

## Option 2: Docker Compose Setup (Recommended)

### 1. Update Environment Variables

Ensure your `backend/.env` file exists (or use Docker environment variables from docker-compose.yml).

### 2. Start All Services

```bash
# From the project root directory
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Kong API Gateway (ports 8000, 8001, 8443, 8444)
- Backend API (port 3000)

### 3. View Logs

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View PostgreSQL logs
docker-compose logs -f postgres
```

### 4. Stop Services

```bash
docker-compose down
```

### 5. Stop and Remove Volumes (Clean Start)

```bash
docker-compose down -v
```

## Testing the Backend

### 1. Health Check

Test if the server is running:

```bash
# Direct backend
curl http://localhost:3000/health

# Through Kong Gateway
curl http://localhost:8000/health
```

### 2. Test User Registration

```bash
curl -X POST http://localhost:3000/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "accountType": "user",
    "currency": "USD"
  }'
```

### 3. Test User Login

```bash
curl -X POST http://localhost:3000/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test OTP Verification

After registration, verify the OTP:

```bash
curl -X POST http://localhost:3000/auth/user/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

### 5. Test Agency Registration

```bash
curl -X POST http://localhost:3000/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Agency Owner",
    "email": "agency@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "accountType": "agency",
    "currency": "USD",
    "dateOfBirth": "1990-01-01",
    "agencyInfo": {
      "agencyName": "Test Agency",
      "businessType": "Technology"
    }
  }'
```

### 6. Test Business Registration

```bash
curl -X POST http://localhost:3000/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Business Owner",
    "email": "business@example.com",
    "password": "password123",
    "accountType": "business",
    "currency": "USD",
    "dateOfBirth": "1985-01-01",
    "businessInfo": {
      "businessName": "Test Business",
      "businessIndustry": "Technology"
    }
  }'
```

### 7. Test Get Current User (Protected Route)

```bash
# First, login to get a token
TOKEN=$(curl -X POST http://localhost:3000/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# Use the token to access protected route
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Using Postman

Import the collection file:
- `backend/Vero2-Auth.postman_collection.json`

Update the base URL in the collection variables if needed.

## Database Connection Verification

### Check PostgreSQL Connection

```bash
# From host machine
psql -h localhost -p 5432 -U postgres -d vero2

# From Docker container
docker exec -it vero2-postgres psql -U postgres -d vero2
```

### Check Tables

```sql
\dt  -- List all tables
SELECT * FROM users LIMIT 5;
SELECT * FROM admins LIMIT 5;
```

## Kong Gateway Setup (Optional)

If you want to use Kong Gateway, register the backend service:

### 1. Create Service

```bash
curl -i -X POST http://localhost:8001/services/ \
  --data "name=backend-api" \
  --data "url=http://backend:3000"
```

### 2. Create Route

```bash
curl -i -X POST http://localhost:8001/services/backend-api/routes \
  --data "paths[]=/api" \
  --data "paths[]=/health" \
  --data "paths[]=/auth"
```

### 3. Test Through Kong

```bash
curl http://localhost:8000/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test2@example.com",
    "password": "password123",
    "accountType": "user"
  }'
```

## Troubleshooting

### PostgreSQL Connection Error

1. Check if PostgreSQL is running:
```bash
docker-compose ps postgres
```

2. Check PostgreSQL logs:
```bash
docker-compose logs postgres
```

3. Verify credentials in `.env` file match Docker Compose settings.

### TypeORM Synchronization Error

If you get entity synchronization errors:

1. Check PostgreSQL is accessible
2. Verify database exists
3. Check entity definitions match database schema
4. Consider using migrations instead of `synchronize: true`

### Redis Connection Error

1. Check if Redis is running:
```bash
docker-compose ps redis
```

2. Test Redis connection:
```bash
docker exec -it vero2-redis redis-cli ping
```

### Port Already in Use

If port 3000, 5432, or 6379 is already in use:

1. Change port in `.env` and `docker-compose.yml`
2. Or stop the service using that port

## Development Workflow

1. Make code changes
2. In development mode (`npm run start:dev`), changes auto-reload
3. Test endpoints using curl, Postman, or your API client
4. Check logs for errors

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Update `.env` with production values

3. Use migrations instead of `synchronize: true`:
```bash
npm run migration:run
```

4. Start with production command:
```bash
npm run start:prod
```

