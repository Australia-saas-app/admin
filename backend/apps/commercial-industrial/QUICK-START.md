# Technology Service - Quick Start Guide

Fastest way to get the Technology Service up and running for testing.

## Prerequisites

- Docker installed and running
- PostgreSQL database accessible (or use Docker Compose for full stack)

---

## Method 1: Quick Script (Linux/Mac)

```bash
# Make script executable
chmod +x docker-commands.sh

# Run script (builds and starts service)
./docker-commands.sh
```

---

## Method 2: Manual Docker Commands

### Step 1: Create Environment File

```bash
cd technology
cp .env.example .env
# Edit .env with your database and SSO configuration
```

### Step 2: Build and Run

**Linux/Mac:**
```bash
# Build image
docker build -t vero2-technology-service:latest .

# Run container
docker run -d \
  --name vero2-technology-service \
  --env-file .env \
  -p 3011:3011 \
  --restart unless-stopped \
  vero2-technology-service:latest
```

**Windows PowerShell:**
```powershell
# Build image
docker build -t vero2-technology-service:latest .

# Run container (use backticks ` not backslashes \)
docker run -d `
  --name vero2-technology-service `
  --env-file .env `
  -p 3011:3011 `
  --restart unless-stopped `
  vero2-technology-service:latest
```

**Or use single line (all platforms):**
```bash
docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 --restart unless-stopped vero2-technology-service:latest
```

### Step 3: Verify

```bash
# Check logs
docker logs vero2-technology-service

# Test health endpoint
curl http://localhost:3011/api/technical/health
```

---

## Method 3: Windows PowerShell

```powershell
# Build image
docker build -t vero2-technology-service:latest .

# Run container
docker run -d `
  --name vero2-technology-service `
  --env-file .env `
  -p 3011:3011 `
  --restart unless-stopped `
  vero2-technology-service:latest

# Check logs
docker logs vero2-technology-service

# Test health
curl http://localhost:3011/api/technical/health
```

---

## Environment Variables (Required)

Create `.env` file in `technology/` directory:

```env
PORT=3011
NODE_ENV=development

# Database (use host.docker.internal for Windows/Mac)
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2

# SSO Authentication (get from SSO service)
SSO_PUBLIC_KEY=your_sso_public_key_here
SSO_ISSUER=http://localhost:3001/sso

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

**For Linux:** Use actual host IP or `172.17.0.1` instead of `host.docker.internal`

---

## Quick Commands

```bash
# View logs
docker logs -f vero2-technology-service

# Stop service
docker stop vero2-technology-service

# Start service
docker start vero2-technology-service

# Restart service
docker restart vero2-technology-service

# Remove container
docker rm -f vero2-technology-service

# Rebuild and restart (Linux/Mac)
docker stop vero2-technology-service && docker rm vero2-technology-service && docker build -t vero2-technology-service:latest . && docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 vero2-technology-service:latest

# Rebuild and restart (Windows PowerShell)
docker stop vero2-technology-service; docker rm vero2-technology-service; docker build -t vero2-technology-service:latest .; docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 vero2-technology-service:latest
```

---

## Testing

1. **Health Check**
   ```bash
   curl http://localhost:3011/api/technical/health
   ```

2. **API Documentation**
   - Open: http://localhost:3011/api/technical/docs

3. **Postman Collection**
   - Import `Vero2-Technology-Service.postman_collection.json`
   - Set `admin_token` variable (get from SSO service)
   - Start testing endpoints

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs vero2-technology-service
```

### Database connection failed
- Verify `DB_HOST` is correct
- For Docker: Use `host.docker.internal` (Windows/Mac) or actual IP (Linux)
- For Docker Compose: Use service name (e.g., `postgres`)

### Port already in use
```bash
# Find what's using port 3011
lsof -i :3011  # Mac/Linux
netstat -ano | findstr :3011  # Windows

# Change port mapping
docker run -d --name vero2-technology-service -p 3012:3011 --env-file .env vero2-technology-service:latest
```

---

## Next Steps

✅ Service running?  
✅ Health check passing?  
→ Import Postman collection and start testing!

