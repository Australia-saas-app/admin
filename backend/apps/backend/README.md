# Vero2 Backend

Express + MongoDB + Redis + Kong Microservices Architecture

## Architecture Overview

- **Express.js**: Backend API server
- **MongoDB**: Primary database for document storage
- **Redis**: Caching and session management
- **Kong**: API Gateway for microservices architecture

## Prerequisites

- Node.js 18+
- Docker & Docker Compose

## Quick Start

### Option 1: Using Docker Compose (Recommended)

Start all services with one command:

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Kong API Gateway on ports 8000 (proxy) and 8001 (admin)
- Backend API on port 3000

### Option 2: Local Development

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start MongoDB, Redis, and Kong using Docker Compose:
```bash
docker-compose up -d mongodb redis kong kong-database kong-migrations
```

3. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

## API Endpoints

### Through Kong Gateway (Port 8000)
- **Health Check**: `http://localhost:8000/health`
- **Hello World**: `http://localhost:8000/api/helloworld`

### Direct Backend Access (Port 3000)
- **Health Check**: `http://localhost:3000/health`
- **Hello World**: `http://localhost:3000/api/helloworld`

## Kong Configuration

### Access Kong Admin API
```bash
curl http://localhost:8001/
```

### Register the Backend Service with Kong
```bash
# Create a service
curl -i -X POST http://localhost:8001/services/ \
  --data "name=backend-api" \
  --data "url=http://backend:3000"

# Create a route for the service
curl -i -X POST http://localhost:8001/services/backend-api/routes \
  --data "paths[]=/api" \
  --data "paths[]=/health"
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vero2
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Start production server
npm start
```

## Project Structure

```
backend/
├── server.js           # Main application entry point
├── package.json        # Dependencies and scripts
├── Dockerfile          # Docker configuration
├── .dockerignore       # Docker ignore file
└── README.md           # This file
```

## Service URLs

| Service | URL |
|---------|-----|
| Backend API | http://localhost:3000 |
| Kong Proxy | http://localhost:8000 |
| Kong Admin | http://localhost:8001 |
| MongoDB | mongodb://localhost:27017 |
| Redis | redis://localhost:6379 |

## Testing the Setup

1. **Test Backend Directly**:
```bash
curl http://localhost:3000/api/helloworld
```

2. **Test through Kong Gateway**:
```bash
curl http://localhost:8000/api/helloworld
```

3. **Check Health**:
```bash
curl http://localhost:3000/health
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears data)
docker-compose down -v
```

## Next Steps

- Configure Kong plugins (rate limiting, authentication)
- Add more microservices
- Set up service discovery
- Implement API grants and rate limiting

