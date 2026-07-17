# Docker Commands for Technology Service

Complete guide to build and run the Technology Service using Docker.

## Prerequisites

1. **Docker** installed and running
2. **Docker Compose** (for running with dependencies)
3. **Environment variables** configured
4. **PostgreSQL** database accessible (or use Docker Compose)

---

## Quick Start

### Option 1: Build and Run Standalone (Recommended for Testing)

#### Step 1: Create Environment File

Create `.env` file in `technology/` directory:

```bash
cd technology
cp .env.example .env
# Edit .env with your configuration
```

Example `.env`:
```env
PORT=3011
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2

# SSO Authentication
SSO_PUBLIC_KEY=your_sso_public_key_here
SSO_ISSUER=http://localhost:3001/sso

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

#### Step 2: Build Docker Image

```bash
# From technology directory
docker build -t vero2-technology-service:latest .
```

#### Step 3: Run Container

**For Linux/Mac:**
```bash
docker run -d \
  --name vero2-technology-service \
  --env-file .env \
  -p 3011:3011 \
  --restart unless-stopped \
  vero2-technology-service:latest
```

**For Windows PowerShell:**
```powershell
docker run -d `
  --name vero2-technology-service `
  --env-file .env `
  -p 3011:3011 `
  --restart unless-stopped `
  vero2-technology-service:latest
```

**Single Line (All Platforms):**
```bash
docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 --restart unless-stopped vero2-technology-service:latest
```

#### Step 4: Verify Service is Running

```bash
# Check container status
docker ps

# Check logs
docker logs vero2-technology-service

# Test health endpoint
curl http://localhost:3011/api/technical/health
```

---

## Option 2: Build and Run with Environment Variables

### Build Image

```bash
docker build -t vero2-technology-service:latest .
```

### Run Container with Inline Environment Variables

**For Linux/Mac:**
```bash
docker run -d \
  --name vero2-technology-service \
  -p 3011:3011 \
  -e PORT=3011 \
  -e NODE_ENV=development \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=your_password \
  -e DB_NAME=vero2 \
  -e SSO_PUBLIC_KEY="your_sso_public_key_here" \
  -e SSO_ISSUER=http://host.docker.internal:3001/sso \
  -e RATE_LIMIT_TTL=60 \
  -e RATE_LIMIT_MAX=100 \
  --restart unless-stopped \
  vero2-technology-service:latest
```

**For Windows PowerShell:**
```powershell
docker run -d `
  --name vero2-technology-service `
  -p 3011:3011 `
  -e PORT=3011 `
  -e NODE_ENV=development `
  -e DB_HOST=host.docker.internal `
  -e DB_PORT=5432 `
  -e DB_USERNAME=postgres `
  -e DB_PASSWORD=your_password `
  -e DB_NAME=vero2 `
  -e SSO_PUBLIC_KEY="your_sso_public_key_here" `
  -e SSO_ISSUER=http://host.docker.internal:3001/sso `
  -e RATE_LIMIT_TTL=60 `
  -e RATE_LIMIT_MAX=100 `
  --restart unless-stopped `
  vero2-technology-service:latest
```

**Note:** Use `host.docker.internal` to access services on host machine from Docker container (Windows/Mac). For Linux, use host network mode or actual host IP.

---

## Option 3: Using Docker Compose (Recommended for Full Stack)

### Step 1: Update Root docker-compose.yml

Add Technology Service to root `docker-compose.yml`:

```yaml
  technology-service:
    build:
      context: ./technology-service
      dockerfile: Dockerfile
    container_name: vero2-technology-service
    restart: unless-stopped
    ports:
      - "${TECHNOLOGY_PORT:-3011}:3011"
    environment:
      PORT: ${TECHNOLOGY_PORT:-3011}
      NODE_ENV: ${NODE_ENV:-production}
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${BACKEND_DB_USER:?BACKEND_DB_USER not set}
      DB_PASSWORD: ${BACKEND_DB_PASSWORD:?BACKEND_DB_PASSWORD not set}
      DB_NAME: ${BACKEND_DB_NAME:-vero2_backend}
      SSO_PUBLIC_KEY: ${SSO_PUBLIC_KEY:?SSO_PUBLIC_KEY not set}
      SSO_ISSUER: ${SSO_ISSUER:-http://sso:3001/sso}
      RATE_LIMIT_TTL: ${RATE_LIMIT_TTL:-60}
      RATE_LIMIT_MAX: ${RATE_LIMIT_MAX:-100}
    networks:
      - vero2-network
    depends_on:
      postgres:
        condition: service_healthy
      sso:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3011/api/technical/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
```

### Step 2: Build and Run with Docker Compose

```bash
# From root directory
docker-compose build technology-service
docker-compose up -d technology-service
```

Or build and run all services:

```bash
docker-compose up -d
```

---

## Docker Commands Reference

### Build Commands

```bash
# Build image
docker build -t vero2-technology-service:latest .

# Build with no cache
docker build --no-cache -t vero2-technology-service:latest .

# Build with specific tag
docker build -t vero2-technology-service:v1.0.0 .
```

### Run Commands

```bash
# Run in detached mode (background) - Single line (all platforms)
docker run -d --name vero2-technology-service -p 3011:3011 vero2-technology-service:latest

# Run in foreground (see logs) - Single line (all platforms)
docker run --name vero2-technology-service -p 3011:3011 vero2-technology-service:latest

# Run with environment file - Single line (all platforms)
docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 vero2-technology-service:latest

# Run with network access (Linux/Mac)
docker run -d \
  --name vero2-technology-service \
  --network vero2-network \
  --env-file .env \
  -p 3011:3011 \
  vero2-technology-service:latest

# Run with network access (Windows PowerShell)
docker run -d `
  --name vero2-technology-service `
  --network vero2-network `
  --env-file .env `
  -p 3011:3011 `
  vero2-technology-service:latest
```

### Management Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs
docker logs vero2-technology-service

# Follow logs (real-time)
base) PS D:\vero2 new> docker logs -f vero2-technology-service

> vero2-backend@1.0.0 start:prod
> node dist/main

node:internal/modules/cjs/loader:1460
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Error loading shared library /app/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node: Exec format error
    at Module._extensions..node (node:internal/modules/cjs/loader:1460:18)
    at Module.load (node:internal/modules/cjs/loader:1203:32)
    at Module._load (node:internal/modules/cjs/loader:1019:12)
    at Module.require (node:internal/modules/cjs/loader:1231:19)
    at require (node:internal/modules/helpers:177:18)
    at Object.<anonymous> (/app/node_modules/bcrypt/bcrypt.js:6:16)
    at Module._compile (node:internal/modules/cjs/loader:1364:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
    at Module.load (node:internal/modules/cjs/loader:1203:32)
    at Module._load (node:internal/modules/cjs/loader:1019:12) {
  code: 'ERR_DLOPEN_FAILED'
}

Node.js v18.20.8
(base) PS D:\vero2 new> 

# Stop container
docker stop vero2-technology-service

# Start stopped container
docker start vero2-technology-service

# Restart container
docker restart vero2-technology-service

# Remove container
docker rm vero2-technology-service

# Remove container and image
docker rm -f vero2-technology-service
docker rmi vero2-technology-service:latest

# Execute command in running container
docker exec -it vero2-technology-service sh

# View container details
docker inspect vero2-technology-service
```

### Health Check

```bash
# Check container health
docker ps --filter "name=vero2-technology-service" --format "table {{.Names}}\t{{.Status}}"

# Test health endpoint
curl http://localhost:3011/api/technical/health

# Check container logs for errors
docker logs vero2-technology-service --tail 50
```

### Debugging Commands

```bash
# View container logs
docker logs vero2-technology-service

# View last 100 lines
docker logs vero2-technology-service --tail 100

# View logs with timestamps
docker logs vero2-technology-service -t

# Execute shell in container
docker exec -it vero2-technology-service sh

# Check environment variables
docker exec vero2-technology-service env

# Check if port is listening
docker exec vero2-technology-service netstat -tlnp

# Test database connection from container
docker exec vero2-technology-service sh -c "echo 'SELECT 1;' | psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME"
```

---

## Development Workflow

### Local Development with Hot Reload

For development with hot reload, run without Docker:

```bash
cd technology
npm install
npm run start:dev
```

### Production Build and Deploy

```bash
# 1. Build production image
docker build -t vero2-technology-service:latest .

# 2. Tag for registry (optional)
docker tag vero2-technology-service:latest your-registry/vero2-technology-service:v1.0.0

# 3. Push to registry (optional)
docker push your-registry/vero2-technology-service:v1.0.0

# 4. Run on server
docker run -d \
  --name vero2-technology-service \
  --env-file .env \
  -p 3011:3011 \
  --restart unless-stopped \
  vero2-technology-service:latest
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker logs vero2-technology-service

# Common issues:
# - Database connection failed: Check DB_HOST, DB_PORT, credentials
# - SSO_PUBLIC_KEY missing: Set environment variable
# - Port already in use: Change PORT or stop conflicting service
```

### Database Connection Issues

```bash
# Test database connectivity
docker exec vero2-technology-service sh -c "nc -zv $DB_HOST $DB_PORT"

# For host.docker.internal (Windows/Mac)
# Ensure database is accessible from host

# For Linux, use actual IP or network mode
docker run --network host vero2-technology-service:latest
```

### Port Already in Use

```bash
# Check what's using port 3011
lsof -i :3011  # Mac/Linux
netstat -ano | findstr :3011  # Windows

# Change port
docker run -d --name vero2-technology-service -p 3012:3011 -e PORT=3011 vero2-technology-service:latest
```

### Environment Variables Not Working

```bash
# Verify environment variables
docker exec vero2-technology-service env | grep DB_

# Check if .env file is loaded correctly
docker run --env-file .env vero2-technology-service:latest env
```

### Container Health Check Failed

```bash
# Manually test health endpoint
docker exec vero2-technology-service wget -qO- http://localhost:3011/api/technical/health

# Check if service is listening
docker exec vero2-technology-service netstat -tlnp | grep 3011
```

---

## Complete Example: Full Stack with Docker Compose

### 1. Update Root docker-compose.yml

Add to services section:

```yaml
  technology-service:
    build:
      context: ./technology-service
      dockerfile: Dockerfile
    container_name: vero2-technology-service
    restart: unless-stopped
    ports:
      - "3011:3011"
    environment:
      PORT: 3011
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${BACKEND_DB_USER}
      DB_PASSWORD: ${BACKEND_DB_PASSWORD}
      DB_NAME: ${BACKEND_DB_NAME:-vero2_backend}
      SSO_PUBLIC_KEY: ${SSO_PUBLIC_KEY}
      SSO_ISSUER: http://sso:3001/sso
      RATE_LIMIT_TTL: 60
      RATE_LIMIT_MAX: 100
    networks:
      - vero2-network
    depends_on:
      postgres:
        condition: service_healthy
      sso:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3011/api/technical/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

### 2. Build and Start

```bash
# Build technology service
docker-compose build technology-service

# Start all services
docker-compose up -d

# Or start only technology service and dependencies
docker-compose up -d postgres sso technology-service
```

### 3. Verify

```bash
# Check all services
docker-compose ps

# Check technology service logs
docker-compose logs technology-service

# Test health endpoint
curl http://localhost:3011/api/technical/health
```

---

## Quick Reference Commands

```bash
# Build image
docker build -t vero2-technology-service:latest .

# Run container
docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 vero2-technology-service:latest

# View logs
docker logs -f vero2-technology-service

# Stop container
docker stop vero2-technology-service

# Remove container
docker rm vero2-technology-service

# Rebuild and restart (Linux/Mac)
docker stop vero2-technology-service && docker rm vero2-technology-service && docker build -t vero2-technology-service:latest . && docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 vero2-technology-service:latest

# Rebuild and restart (Windows PowerShell)
docker stop vero2-technology-service; docker rm vero2-technology-service; docker build -t vero2-technology-service:latest .; docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 vero2-technology-service:latest
```

---

## Next Steps

1. ✅ Build Docker image
2. ✅ Run container with environment variables
3. ✅ Verify health endpoint: `http://localhost:3011/api/technical/health`
4. ✅ Test API endpoints using Postman collection
5. ✅ Check Swagger documentation: `http://localhost:3011/api/technical/docs`

