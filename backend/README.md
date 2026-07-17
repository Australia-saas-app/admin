# Vero2 Project

Express + MongoDB + Redis + Kong Microservices Architecture

## 📖 Setup Guide

**Complete setup instructions:** [`docs/SETUP-GUIDE.md`](docs/SETUP-GUIDE.md)

Step-by-step guide from Docker Desktop installation to running the API. Perfect for non-technical users.

## Quick Start

### Prerequisites
**IMPORTANT**: Make sure Docker Desktop is running before starting!

If Docker Desktop is not running:
1. Start Docker Desktop from Windows Start Menu
2. Wait until it's fully started (green whale icon in system tray)
3. Then proceed with the steps below

### Start All Services

**Option 1: Prepare environment**
```bash
copy config\env.example .env   # Windows
# or
cp config/env.example .env     # macOS/Linux
```
Edit `.env` to replace every `change-me-...` value with a secure secret (generate with `openssl rand -base64 48`).

**Option 2: Using Docker Compose**
```bash
docker-compose up -d
```


## Service Access

| Service | URL | Description |
|---------|-----|-------------|
| **Backend API** (Direct) | http://localhost:3000 | Direct backend access |
| **Kong Proxy** | http://localhost:8000 | API through Gateway |
| **SSO Service** | http://localhost:3001 | OAuth2 / OIDC provider |
| **Kong Admin** | *(internal-only)* | Admin API exposed only on the Docker network |
| **PostgreSQL / MongoDB / Redis** | *(internal-only)* | Datastores inaccessible from host |

## Test Endpoints

### Through Kong Gateway
```bash
curl http://localhost:8000/api/helloworld
```

### Direct Backend Access
```bash
curl http://localhost:3000/api/helloworld
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Project Structure

```
.
├── apps/                # All application services
│   ├── backend/                     # Backend API service
│   ├── sso/                         # OAuth2 / OIDC provider
│   ├── admin/                       # Admin app
│   ├── user-profile/                # User profile domain
│   ├── order/                       # Orders domain
│   ├── construction/                # Construction domain
│   ├── commercial-industrial/       # Commercial & industrial domain
│   ├── payment/                     # Payments domain
│   ├── real-estate/                 # Real estate domain
│   ├── technology/                  # Technology domain
│   ├── visa-travel/                 # Visa & travel domain
│   └── marketplace/                 # Marketplace service
├── config/
│   └── env.example      # Template for environment configuration
├── docker-compose.yml   # All services configuration
├── docker/
│   ├── mongo/           # MongoDB init scripts
│   └── postgres/        # PostgreSQL init scripts
├── docs/                # Documentation
│   └── SETUP-GUIDE.md   # Setup instructions
└── README.md            # This file
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Kong API Gateway                │
│         (Port 8000)                     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Backend API   │
         │  (Express)     │
         │  (Port 3000)   │
         └────┬───────┬───┘
              │       │
        ┌─────▼───┐ ┌─▼─────┐
        │ MongoDB │ │ Redis │
        │ Port    │ │ Port  │
        │ 27017   │ │ 6379  │
        └─────────┘ └───────┘
```

## Environment Variables

Configuration now lives in a single `.env` file at the repository root. Copy `config/env.example` to `.env`, keep the file out of version control, and replace every placeholder with real credentials. Secrets should be at least 32 random bytes (`openssl rand -base64 48`).

## Development

### Local Development (without Docker)
```bash
cd backend
npm install
npm start
```

### With Docker
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

## Next Steps

- [ ] Add more API endpoints
- [ ] Implement authentication
- [ ] Add more microservices
- [ ] Configure rate limiting
- [ ] Setup monitoring

