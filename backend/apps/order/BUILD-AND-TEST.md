# Technology Service - Build and Test Guide

## ✅ All Issues Fixed

1. ✅ TypeScript compilation errors fixed
2. ✅ Dockerfile optimized for Alpine Linux
3. ✅ package-lock.json generated
4. ✅ Route ordering fixed (specific routes before parameterized)
5. ✅ TypeORM entity creation issues resolved
6. ✅ **CRITICAL FIX**: Added missing `COPY --from=builder /app/dist ./dist` in Dockerfile (was causing "Cannot find module '/app/dist/main'" error)

## Quick Rebuild Commands

### Step 1: Stop and Remove Old Container/Image

**PowerShell:**
```powershell
cd technology
docker stop vero2-technology-service; docker rm vero2-technology-service; docker rmi vero2-technology-service:latest
```

**Or if container doesn't exist (ignore errors):**
```powershell
docker stop vero2-technology-service 2>$null; docker rm vero2-technology-service 2>$null; docker rmi vero2-technology-service:latest 2>$null
```

### Step 2: Rebuild Image (No Cache)

**PowerShell:**
```powershell
docker build --no-cache -t vero2-technology-service:latest .
```

### Step 3: Run Container

**PowerShell:**
```powershell
docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 --restart unless-stopped vero2-technology-service:latest
```

### Step 4: Verify Service

```powershell
# Check logs
docker logs -f vero2-technology-service

# Test health endpoint
curl http://localhost:3011/api/technical/health
```

## Complete One-Liner (PowerShell)

```powershell
cd technology; docker stop vero2-technology-service 2>$null; docker rm vero2-technology-service 2>$null; docker rmi vero2-technology-service:latest 2>$null; docker build --no-cache -t vero2-technology-service:latest .; docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 --restart unless-stopped vero2-technology-service:latest
```

## What Was Fixed

### 1. TypeScript Errors
- **Issue**: TypeORM `create()` method conflict with `category` property
- **Fix**: Destructured DTO to exclude `category` string, used `categoryId` instead

### 2. Docker Build
- **Issue**: Native modules (pg driver) not compiled for Alpine
- **Fix**: Added build tools in builder stage, copy pre-compiled node_modules

### 3. package-lock.json
- **Issue**: Missing package-lock.json for `npm ci`
- **Fix**: Generated package-lock.json using `npm install`

### 4. Route Ordering
- **Issue**: Potential route conflicts between `admin/list` and `:serviceId`
- **Fix**: Reordered routes - specific routes before parameterized

### 5. Dockerfile Verification
- **Fix**: Added package name verification step in Dockerfile

### 6. Missing `dist` Folder in Docker Container
- **Issue**: Docker container couldn't find `/app/dist/main` - `dist` folder was not being copied from builder stage
- **Error**: `Error: Cannot find module '/app/dist/main'`
- **Fix**: Added `COPY --from=builder /app/dist ./dist` to copy built application from builder stage to production stage

## Testing Checklist

After container starts:

- [ ] Health check: `curl http://localhost:3011/api/technical/health`
- [ ] Swagger docs: `http://localhost:3011/api/technical/docs`
- [ ] Public services: `GET http://localhost:3011/api/technical/services`
- [ ] Create service (Admin): `POST http://localhost:3011/api/technical/services` (with Bearer token)
- [ ] Create category (Admin): `POST http://localhost:3011/api/technical/services/categories` (with Bearer token)

## Common Issues

### Container Won't Start
```powershell
# Check logs
docker logs vero2-technology-service

# Common causes:
# - Database connection failed: Check DB_HOST and credentials in .env
# - SSO_PUBLIC_KEY missing: Set in .env
# - Port already in use: Stop conflicting service or change port
```

### Build Fails
```powershell
# Clean build (removes all cache)
docker build --no-cache -t vero2-technology-service:latest .

# Check for TypeScript errors locally first
npm run build
```

### Database Connection Issues
- **Windows/Mac**: Use `host.docker.internal` as DB_HOST
- **Linux**: Use actual host IP or `172.17.0.1`
- **Docker Compose**: Use service name (e.g., `postgres`)

## Next Steps After Successful Build

1. ✅ Service running on port 3011
2. ✅ Health endpoint responding
3. → Import Postman collection
4. → Get admin token from SSO service
5. → Test all endpoints

