# Quick Start - Construction Service with Docker

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database running (or use the included docker-compose)
- SSO Service running (for authentication tokens)

## Option 1: Standalone Docker Compose (Recommended for Testing)

This runs Construction Service with its own PostgreSQL instance.

### Step 1: Navigate to Construction Service Directory

```bash
cd construction
```

### Step 2: Create Environment File

**Windows PowerShell:**
```powershell
if (-not (Test-Path .env)) { Copy-Item env.template .env }
```

**Linux/Mac:**
```bash
cp env.template .env
```

### Step 3: Update .env File

Edit `.env` and set:
- `DB_HOST=postgres` (use `postgres` when using docker-compose, or `host.docker.internal` for external DB)
- `DB_PASSWORD=your_password`
- `SSO_PUBLIC_KEY=your_sso_public_key` (get from SSO service)

### Step 4: Build and Run

**Windows PowerShell:**
```powershell
docker-compose up -d --build
```

**Linux/Mac:**
```bash
docker-compose up -d --build
```

### Step 5: Check Service Status

```bash
# Check logs
docker-compose logs -f construction-service

# Check health
curl http://localhost:3011/api/construction/health
```

## Option 2: Run with Main Docker Compose

If you want to run Construction Service with all other services:

### Step 1: Navigate to Root Directory

```bash
cd ..
```

### Step 2: Ensure Main Services are Running

```bash
# Start all services including Construction Service
docker-compose up -d --build construction-service

# Or start everything
docker-compose up -d
```

### Step 3: Verify Construction Service

```bash
# Check if service is running
docker-compose ps construction-service

# Check logs
docker-compose logs -f construction-service

# Test health endpoint
curl http://localhost:3011/api/construction/health
```

## Testing with Postman

1. **Import Collection**: Import `Vero2-Construction-Service.postman_collection.json` into Postman

2. **Get Authentication Tokens**:
   - **Admin Token**: `POST http://localhost:3001/auth/admin/login`
   - **User Token**: `POST http://localhost:3001/auth/user/login`

3. **Set Collection Variables**:
   - `base_url`: `http://localhost:3011`
   - `admin_token`: Your admin JWT token
   - `user_token`: Your user/agency JWT token

4. **Test Endpoints**:
   - Start with Health Check
   - Then try Public routes
   - Use Admin routes for full CRUD operations

## API Endpoints

- **Health**: `http://localhost:3011/api/construction/health`
- **Swagger Docs**: `http://localhost:3011/api/construction/docs`
- **Public Services**: `GET http://localhost:3011/api/construction/services`
- **Admin Services**: `GET http://localhost:3011/api/construction/services/admin/list`

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs construction-service

# Check if port is in use
netstat -an | findstr 3011  # Windows
lsof -i :3011  # Linux/Mac
```

### Database Connection Issues

```bash
# Ensure PostgreSQL is running
docker-compose ps postgres

# Test database connection from container
docker-compose exec construction-service sh -c "node -e \"console.log('DB_HOST:', process.env.DB_HOST)\""
```

### Missing SSO Public Key

1. Get SSO public key from SSO service:
   ```bash
   curl http://localhost:3001/sso/.well-known/jwks.json
   ```

2. Update `.env` file with the public key

### Rebuild from Scratch

```bash
# Stop and remove
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Useful Commands

```bash
# View logs
docker-compose logs -f construction-service

# Stop service
docker-compose stop construction-service

# Start service
docker-compose start construction-service

# Restart service
docker-compose restart construction-service

# Remove service
docker-compose rm -f construction-service

# Execute command in container
docker-compose exec construction-service sh
```

## Environment Variables Reference

```env
PORT=3011
NODE_ENV=development
DB_HOST=postgres  # or host.docker.internal for external DB
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2_backend
SSO_PUBLIC_KEY=your_sso_public_key
SSO_ISSUER=http://sso:3001/sso  # or http://localhost:3001/sso
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## Next Steps

1. ✅ Service is running
2. ✅ Test health endpoint
3. ✅ Import Postman collection
4. ✅ Get authentication tokens
5. ✅ Test all endpoints


