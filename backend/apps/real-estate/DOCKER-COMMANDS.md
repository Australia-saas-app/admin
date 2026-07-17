# Docker Commands for Real Estate Service

## Quick Start

### Using PowerShell (Windows)
```powershell
.\docker-run.ps1
```

### Using Bash (Linux/Mac)
```bash
chmod +x docker-run.sh
./docker-run.sh
```

## Manual Docker Commands

### Build the Docker image
```bash
docker-compose build
```

### Start the service
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f real-estate-service
```

### Stop the service
```bash
docker-compose down
```

### Rebuild and restart
```bash
docker-compose up -d --build
```

### Check service status
```bash
docker-compose ps
```

### Check health
```bash
curl http://localhost:3013/api/real-estate/health
```

## Service Information

- **Container Name**: `vero2-real-estate-service`
- **Port Mapping**: `3013:3011` (host:container)
- **Health Check**: `http://localhost:3013/api/real-estate/health`
- **API Docs**: `http://localhost:3013/api/real-estate/docs`
- **Network**: `vero2new_vero2-network` (external)

## Environment Variables

The service uses environment variables from `.env` file or `docker-compose.yml`. Make sure to configure:

- `DB_HOST`: Database host (default: `vero2-postgres`)
- `DB_PORT`: Database port (default: `5432`)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `SSO_PUBLIC_KEY`: SSO service public key
- `SSO_ISSUER`: SSO service issuer URL

## Troubleshooting

### Service not starting
```bash
# Check logs
docker-compose logs real-estate-service

# Check if network exists
docker network ls | grep vero2-network

# If network doesn't exist, create it
docker network create vero2new_vero2-network
```

### Database connection issues
- Verify database is running and accessible
- Check database credentials in `.env` file
- Ensure network connectivity between containers

### Port already in use
- Change the port mapping in `docker-compose.yml` (first number)
- Or stop the service using the port


