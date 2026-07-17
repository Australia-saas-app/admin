# Environment Setup Guide

## Quick Setup

### Option 1: Use PowerShell Script (Recommended)

```powershell
cd technology
.\create-env.ps1
```

Then edit `.env` file with your actual values.

### Option 2: Manual Creation

**Windows PowerShell:**
```powershell
cd technology
Copy-Item env.template .env
# Then edit .env file with your values
notepad .env
```

**Linux/Mac:**
```bash
cd technology
cp env.template .env
# Then edit .env file with your values
nano .env
```

### Option 3: Create Directly

**Windows PowerShell:**
```powershell
cd technology
@"
PORT=3011
NODE_ENV=development
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=vero2
SSO_PUBLIC_KEY=your_sso_public_key_here
SSO_ISSUER=http://localhost:3001/sso
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
"@ | Out-File -FilePath ".env" -Encoding utf8
```

## Required Values to Update

1. **DB_PASSWORD** - Your PostgreSQL database password
2. **SSO_PUBLIC_KEY** - Get from SSO service (Port 3001)
3. **DB_HOST** - Use `host.docker.internal` for Windows/Mac, or actual IP for Linux

## Get SSO Public Key

1. If SSO service is running, get it from:
   - `http://localhost:3001/sso/.well-known/jwks.json`
2. Or check your root `.env` file for `SSO_PUBLIC_KEY`

## After Creating .env

```powershell
# Build image
docker build -t vero2-technology-service:latest .

# Run container
docker run -d --name vero2-technology-service --env-file .env -p 3011:3011 --restart unless-stopped vero2-technology-service:latest
```




