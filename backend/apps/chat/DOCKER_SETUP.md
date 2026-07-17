# Docker Setup Guide for Chat Service

## 🐳 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Ensure you have a `.env` file** with all required variables (copy from `env.template`)

2. **Build and run all services:**
```bash
cd apps/chat
docker-compose up -d --build
```

3. **View logs:**
```bash
docker-compose logs -f chat-service
```

4. **Stop services:**
```bash
docker-compose down
```

### Option 2: Using Docker Commands

1. **Build the image:**
```bash
cd apps/chat
docker build -t vero2-chat-service:latest .
```

2. **Run the container:**
```bash
docker run -d \
  --name vero2-chat-service \
  -p 3006:3006 \
  --env-file .env \
  --network vero2-network \
  vero2-chat-service:latest
```

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- MongoDB (or use the one in docker-compose)
- Redis (or use the one in docker-compose)

## 🔧 Environment Variables

Create a `.env` file in `apps/chat/` directory:

```env
# Service Configuration
PORT=3006
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/chat_db
MONGODB_DB_NAME=chat_db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# SSO Service
SSO_SERVICE_URL=http://sso-service:3001
SSO_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
SSO_ISSUER=http://sso-service:3001/sso

# External Services
ORDER_SERVICE_URL=http://order-service:3003
USER_PROFILE_SERVICE_URL=http://user-profile-service:3005
ADMIN_SERVICE_URL=http://admin-service:3007
FILE_STORAGE_SERVICE_URL=http://file-storage-service:3009
NOTIFICATION_SERVICE_URL=http://notification-service:3008

# Kafka
KAFKA_BROKERS=kafka:9092
KAFKA_CLIENT_ID=chat-service
KAFKA_GROUP_ID=chat-service-group

# File Upload
MAX_FILE_SIZE=1048576
ALLOWED_FILE_TYPES=pdf,image/*,audio/*,video/*

# Message Expiration
ORDER_CHAT_EXPIRATION_DAYS=7
AGENCY_CHAT_EXPIRATION_DAYS=7
LIVE_CHAT_OFFLINE_TIMEOUT_MINUTES=15
ADMIN_TIMEOUT_MINUTES=10

# Security
JWT_SECRET=your-secret-key-here
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## 🏗️ Build Process

The Dockerfile uses a **multi-stage build**:

1. **Builder Stage**: Installs all dependencies and builds the TypeScript code
2. **Production Stage**: Copies only the built files and production dependencies

This results in a smaller final image (~200MB vs ~500MB).

## 🚀 Running the Service

### Start all services (Chat + MongoDB + Redis):
```bash
docker-compose up -d
```

### Start only Chat Service (if MongoDB/Redis are external):
```bash
docker-compose up -d chat-service
```

### View logs:
```bash
# All services
docker-compose logs -f

# Only chat service
docker-compose logs -f chat-service

# Last 100 lines
docker-compose logs --tail=100 chat-service
```

### Check service status:
```bash
docker-compose ps
```

### Health check:
```bash
curl http://localhost:3006/api/chat/health
```

## 🔍 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs chat-service

# Check if port is already in use
lsof -i :3006

# Remove and recreate
docker-compose down
docker-compose up -d --build
```

### MongoDB connection issues
```bash
# Check MongoDB container
docker-compose logs mongodb

# Test MongoDB connection
docker-compose exec mongodb mongosh chat_db
```

### Redis connection issues
```bash
# Check Redis container
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Build fails
```bash
# Clean build (no cache)
docker-compose build --no-cache chat-service

# Check Dockerfile syntax
docker build -t test-build .
```

### Environment variables not loading
- Ensure `.env` file exists in `apps/chat/` directory
- Check file permissions
- Verify variable names match exactly

## 📊 Monitoring

### Container stats:
```bash
docker stats vero2-chat-service
```

### Container inspection:
```bash
docker inspect vero2-chat-service
```

### Execute commands in container:
```bash
docker-compose exec chat-service sh
```

## 🧹 Cleanup

### Stop and remove containers:
```bash
docker-compose down
```

### Stop and remove containers + volumes:
```bash
docker-compose down -v
```

### Remove images:
```bash
docker rmi vero2-chat-service:latest
```

### Full cleanup (containers + volumes + images):
```bash
docker-compose down -v --rmi all
```

## 🔐 Security Notes

1. **Never commit `.env` file** to version control
2. Use **secrets management** in production (Docker Secrets, Kubernetes Secrets, etc.)
3. The container runs as **non-root user** (nestjs:1001)
4. Health checks are enabled for automatic recovery

## 🌐 Network Configuration

The service uses a Docker network (`vero2-network`) for inter-service communication. If other services are on the same network, use service names as hostnames:

- `sso-service:3001`
- `order-service:3003`
- `mongodb:27017`
- `redis:6379`

## 📝 Production Deployment

For production, consider:

1. **Use Docker Secrets** for sensitive data
2. **Enable SSL/TLS** with reverse proxy (Nginx/Traefik)
3. **Set up monitoring** (Prometheus, Grafana)
4. **Configure log aggregation** (ELK Stack)
5. **Use orchestration** (Kubernetes, Docker Swarm)
6. **Set resource limits** in docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

