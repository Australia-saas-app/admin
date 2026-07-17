# Environment Variables Setup Guide

## 📋 Quick Setup

### For Docker Deployment (Recommended)
Copy `env.template` to `.env` - it's already configured for Docker:
```bash
cp env.template .env
```

### For Local Development
If running locally (not in Docker), update these values in `.env`:

```env
# MongoDB - Use localhost for local development
MONGODB_URI=mongodb://localhost:27017/chat_db

# Redis - Use localhost for local development
REDIS_HOST=localhost

# External Services - Use localhost for local development
SSO_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3003
USER_PROFILE_SERVICE_URL=http://localhost:3005
ADMIN_SERVICE_URL=http://localhost:3007
FILE_STORAGE_SERVICE_URL=http://localhost:3009
NOTIFICATION_SERVICE_URL=http://localhost:3008

# Kafka - Use localhost for local development
KAFKA_BROKERS=localhost:9092
```

## 🔧 Environment Variables Explained

### Service Configuration
- `PORT`: Service port (default: 3006)
- `NODE_ENV`: Environment mode (development/production)

### MongoDB
- `MONGODB_URI`: MongoDB connection string
  - **Docker**: `mongodb://mongodb:27017/chat_db`
  - **Local**: `mongodb://localhost:27017/chat_db`
- `MONGODB_DB_NAME`: Database name (default: chat_db)

### Redis
- `REDIS_HOST`: Redis hostname
  - **Docker**: `redis`
  - **Local**: `localhost`
- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASSWORD`: Redis password (optional)

### SSO Service
- `SSO_SERVICE_URL`: SSO service URL
  - **Docker**: `http://sso-service:3001`
  - **Local**: `http://localhost:3001`
- `SSO_PUBLIC_KEY`: Public key for JWT verification (RS256)
- `SSO_ISSUER`: JWT issuer URL

### External Services
All external services follow the same pattern:
- **Docker**: Use service name (e.g., `order-service:3003`)
- **Local**: Use `localhost` (e.g., `localhost:3003`)

### Kafka
- `KAFKA_BROKERS`: Kafka broker addresses
  - **Docker**: `kafka:9092`
  - **Local**: `localhost:9092`
- `KAFKA_CLIENT_ID`: Client identifier
- `KAFKA_GROUP_ID`: Consumer group ID

### File Upload
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 1MB = 1048576)
- `ALLOWED_FILE_TYPES`: Comma-separated list of allowed MIME types

### Message Expiration
- `ORDER_CHAT_EXPIRATION_DAYS`: Days before order chat messages expire (default: 7)
- `AGENCY_CHAT_EXPIRATION_DAYS`: Days before agency chat messages expire (default: 7)
- `LIVE_CHAT_OFFLINE_TIMEOUT_MINUTES`: Minutes before offline live chat messages are deleted (default: 15)
- `ADMIN_TIMEOUT_MINUTES`: Minutes before admin assignment times out (default: 10)

### Security
- `JWT_SECRET`: JWT secret key (change in production!)
- `RATE_LIMIT_TTL`: Rate limit time window in seconds (default: 60)
- `RATE_LIMIT_MAX`: Maximum requests per time window (default: 100)

## ⚠️ Important Notes

1. **Docker vs Local**: The `env.template` is configured for Docker. If running locally, change service names to `localhost`.

2. **SSO_PUBLIC_KEY**: Must be a valid RSA public key in PEM format. Get this from your SSO service.

3. **Never commit `.env`**: The `.env` file should be in `.gitignore` and never committed to version control.

4. **Production**: Always use strong, unique values for `JWT_SECRET` and other security-related variables in production.

## 🔍 Troubleshooting

### MongoDB Connection Issues
- **Error**: `ECONNREFUSED ::1:27017`
- **Fix**: Change `MONGODB_URI` from `localhost` to `mongodb` (Docker) or ensure MongoDB is running locally

### Redis Connection Issues
- **Error**: `Redis connection error`
- **Fix**: Change `REDIS_HOST` from `localhost` to `redis` (Docker) or ensure Redis is running locally

### Service Not Starting
- Check all environment variables are set correctly
- Verify Docker service names match your docker-compose.yml
- Check logs: `docker-compose logs chat-service`

