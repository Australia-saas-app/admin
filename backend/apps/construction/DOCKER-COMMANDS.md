# Docker Commands for Construction Service

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the service
docker-compose up -d

# View logs
docker-compose logs -f construction-service

# Stop the service
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Option 2: Using Docker Run Scripts

**Linux/Mac:**
```bash
chmod +x docker-run.sh
./docker-run.sh
```

**Windows PowerShell:**
```powershell
.\docker-run.ps1
```

### Option 3: Manual Docker Commands

```bash
# Build the image
docker build -t vero2-construction-service .

# Run the container
docker run -d \
  --name vero2-construction-service \
  -p 3011:3011 \
  --env-file .env \
  vero2-construction-service

# View logs
docker logs -f vero2-construction-service

# Stop and remove
docker stop vero2-construction-service
docker rm vero2-construction-service
```

## Environment Setup

1. **Create `.env` file** from template:
   ```bash
   cp env.template .env
   ```

2. **Update `.env` with your configuration:**
   ```env
   PORT=3011
   NODE_ENV=production
   DB_HOST=host.docker.internal  # Use 'postgres' if using docker-compose
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=vero2
   SSO_PUBLIC_KEY=your_sso_public_key_here
   SSO_ISSUER=http://localhost:3001/sso
   RATE_LIMIT_TTL=60
   RATE_LIMIT_MAX=100
   ```

## Docker Compose Services

The `docker-compose.yml` includes:
- **construction-service**: The main service (port 3011)
- **postgres**: PostgreSQL database (port 5432)

## Health Check

```bash
# Check service health
curl http://localhost:3011/api/construction/health

# Or in browser
http://localhost:3011/api/construction/health
```

## API Documentation

Once running, access Swagger docs at:
```
http://localhost:3011/api/construction/docs
```

## Troubleshooting

### Service won't start
```bash
# Check logs
docker-compose logs construction-service

# Check if port is already in use
netstat -an | grep 3011  # Linux/Mac
netstat -an | findstr 3011  # Windows
```

### Database connection issues
```bash
# Ensure PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U postgres -d vero2
```

### Rebuild from scratch
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Production Deployment

For production, ensure:
1. ✅ `.env` file has production values
2. ✅ Database credentials are secure
3. ✅ SSO_PUBLIC_KEY is properly configured
4. ✅ Port 3011 is accessible
5. ✅ Health checks are passing

## Network Configuration

If running with other services, ensure they're on the same Docker network:
```bash
# Create network (if not exists)
docker network create vero2-network

# Services will automatically join the network via docker-compose
```


