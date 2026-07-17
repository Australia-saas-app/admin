# Database Setup for Technology Service

## ⚠️ This is NOT a Code Error - It's a Configuration Issue!

The service code is working fine. You just need to configure the database connection.

## Quick Fix Options:

### Option 1: Use Existing PostgreSQL (Recommended)

If you have PostgreSQL running from `docker-compose`, check the root `.env` file:

1. **Check your main `.env` file** (at project root):
   ```powershell
   cat ..\..\.env
   ```

2. **Update `technology/.env`** with the correct credentials:
   ```env
   # Server Configuration
   PORT=3011
   NODE_ENV=production

   # Database Configuration
   # If running in Docker, use 'postgres' (service name) instead of host.docker.internal
   # If running standalone, use 'host.docker.internal' or 'localhost'
   DB_HOST=host.docker.internal
   DB_PORT=5432
   DB_USERNAME=postgres
   # Use the POSTGRES_PASSWORD from your main .env file
   DB_PASSWORD=change-me-postgres-admin
   DB_NAME=vero2_technology

   # SSO Authentication (get from main .env)
   SSO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nYOUR_KEY_HERE\n-----END PUBLIC KEY-----"
   SSO_ISSUER=http://localhost:3001/sso

   # Rate Limiting
   RATE_LIMIT_TTL=60
   RATE_LIMIT_MAX=100
   ```

### Option 2: Connect to Docker Compose PostgreSQL

If PostgreSQL is running in `docker-compose`:

```env
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USERNAME=postgres_admin
DB_PASSWORD=change-me-postgres-admin
DB_NAME=vero2_technology
```

### Option 3: Create Technology Service Database

Run this in PostgreSQL to create the database and user:

```sql
-- Connect to PostgreSQL as admin
psql -U postgres_admin -h localhost

-- Create database and user
CREATE USER vero2_technology_app WITH PASSWORD 'change-me-technology';
CREATE DATABASE vero2_technology OWNER vero2_technology_app;
GRANT ALL PRIVILEGES ON DATABASE vero2_technology TO vero2_technology_app;
```

Then update `.env`:
```env
DB_USERNAME=vero2_technology_app
DB_PASSWORD=change-me-technology
DB_NAME=vero2_technology
```

## How to Create/Update .env File:

**PowerShell:**
```powershell
cd technology

# Copy template
Copy-Item env.template .env

# Edit .env file with correct credentials
notepad .env
```

**Or use the script:**
```powershell
.\create-env.ps1
```

## Verify Connection:

After updating `.env`, restart the container:

```powershell
docker restart vero2-technology-service

# Check logs
docker logs -f vero2-technology-service
```

## Common Issues:

1. **"password authentication failed"**
   - Check `DB_PASSWORD` matches your PostgreSQL password
   - Check `DB_USERNAME` exists and has permissions

2. **"connection refused"**
   - Check PostgreSQL is running: `docker ps | grep postgres`
   - Check `DB_HOST` is correct:
     - `host.docker.internal` for Docker → Host connection
     - `postgres` for Docker → Docker connection (same network)
     - `localhost` for local connection

3. **"database does not exist"**
   - Create the database first (see Option 3 above)
   - Or use existing database name from docker-compose

## Next Steps:

Once the database connection works, the service will:
1. ✅ Connect to PostgreSQL
2. ✅ Auto-create tables (if `NODE_ENV=development`)
3. ✅ Start successfully
4. ✅ Respond to health checks

The code is fine - just needs the right database credentials! 🚀




