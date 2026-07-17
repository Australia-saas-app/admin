# API Gateway Local Testing Guide - Vero2

## Overview
This guide provides step-by-step instructions to test Vero2 services locally without Docker, simulating API Gateway functionality by hitting services directly on their local ports. This allows testing the microservices architecture without the Kong proxy layer.

## Prerequisites
- Node.js (v18 or later)
- npm (comes with Node.js)
- PostgreSQL (local installation)
- Redis (local installation)
- OpenSSL (for generating RSA keys, if needed for SSO)

## Step 1: Database and Redis Setup
1. Install and start PostgreSQL locally (default port 5432)
2. Create databases as needed for each service (e.g., `vero2`, `vero2_admin`)
3. Install and start Redis locally (default port 6379)

## Step 2: Service Ports and Setup
Each service runs on its own port locally. Here's the mapping:

- **SSO Service**: Port 3001 (`http://localhost:3001/sso`)
- **Backend Service**: Port 3000 (`http://localhost:3000`)
- **User Profile Service**: Port 3005 (`http://localhost:3005/user-profile-service`)
- **Order Service**: Port 3003 (`http://localhost:3003/api`)
- **Payment Service**: Port 3004 (`http://localhost:3004/api/payment`)
- **Admin Service**: Port 3007 (`http://localhost:3007/admin-service`)
- **Construction Service**: Port 3011 (`http://localhost:3011/api/construction`)
- **Commercial Industrial Service**: Port 3021 (`http://localhost:3021/api/commercial-industrial`)

## Step 3: Setup Each Service Locally
For each service you want to test:

1. Navigate to the service directory (e.g., `apps/sso/`)
2. Install dependencies: `npm install`
3. Configure environment variables (copy `env.example` to `.env` and edit)
4. Generate RSA keys for SSO if needed:
   ```bash
   openssl genrsa -out private.pem 2048
   openssl rsa -in private.pem -pubout -out public.pem
   ```
5. Run the service: `npm run start:dev`

## Step 4: Postman Testing
1. Import relevant Postman collections from service folders or create new requests
2. Set base URLs to the local ports above
3. Test authentication flow first, then protected endpoints

## Available Test Scenarios

### 1. SSO Authentication
- **Login**: `POST http://localhost:3001/sso/token`
  - Body: `grant_type=password&username=demo@vero.local&password=password&client_id=first-party-app&client_secret=[secret]`
- **Expected**: Returns `access_token` JWT
- Save token for authenticated requests

### 2. Service Health Checks (No Auth Required)
- Backend: `GET http://localhost:3000/health`
- User Profile: `GET http://localhost:3005/user-profile-service/health`
- Order: `GET http://localhost:3003/api/orders/health`
- Payment: `GET http://localhost:3004/api/payment/health`
- Admin: `GET http://localhost:3007/admin-service/health`
- Construction: `GET http://localhost:3011/api/construction/health`
- Commercial Industrial: `GET http://localhost:3021/api/commercial-industrial/health`

### 3. Authenticated Endpoints
Use `Authorization: Bearer <jwt_token>` header for protected routes.

Examples:
- User Profile: `GET http://localhost:3005/user-profile-service/profile`
- Order: `GET http://localhost:3003/api/orders`
- Payment: `GET http://localhost:3004/api/payment/wallet`

## Demo User
Use seeded demo user for testing:
- Email: `demo@vero.local`
- Password: `password`

## Troubleshooting
- **Port conflicts**: Ensure no other services are running on the same ports
- **Database errors**: Verify PostgreSQL/Redis are running and credentials are correct
- **JWT errors**: Check RSA key configuration in SSO service
- **Service startup failures**: Check logs and environment variables

## Notes
- This setup tests services directly, bypassing Kong's routing and plugins
- For full API Gateway testing (with Kong), use the Docker setup from `apps/api-gateway/TESTING-GUIDE.md`
- Rate limiting and other Kong plugins won't apply in this local setup
- CORS and security headers are handled per service

This local testing approach allows for faster development iteration and debugging of individual services.</content>
<parameter name="filePath">D:\vero2 new\test postman collection\API Gateway Local Testing.md