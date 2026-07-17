# User Collection Postman Testing Guide - Vero2

## Overview
This guide provides step-by-step instructions to test the Vero2 User Collection Postman collection locally without Docker. The User Collection covers comprehensive user-related endpoints including Profile Management, Activation, Preferences, Activity Tracking, Wallet Service, Notifications, Orders/Business, and Account Management.

## Prerequisites
- Node.js (v18 or later)
- npm (comes with Node.js)
- PostgreSQL (local installation)
- Redis (local installation)
- OpenSSL (for generating RSA keys)

## Step 1: Database and Redis Setup
1. Install and start PostgreSQL locally (default port 5432)
2. Create databases: `vero2` and `vero2_admin`
3. Install and start Redis locally (default port 6379)

## Step 2: Required Services and Ports
The User Collection tests multiple services. Set up the following locally:

- **SSO Service**: Port 3001 (`http://localhost:3001/sso`)
- **User Profile Service**: Port 3005 (`http://localhost:3005/user-profile-service`)
- **Order Service**: Port 3003 (`http://localhost:3003/api`)
- **Chat Service**: Port 3006 (`http://localhost:3006/api/chat`)
- **Backend Service**: Port 3000 (`http://localhost:3000`) - for some endpoints
- **Admin Service**: Port 3007 (`http://localhost:3007/admin-service`) - for admin operations

## Step 3: Setup Each Required Service
For each service:

1. Navigate to service directory (e.g., `apps/sso/`)
2. Install dependencies: `npm install`
3. Configure environment:
   - Copy `env.example` to `.env`
   - Set database credentials, Redis URL, and other configs
4. For SSO: Generate RSA keys:
   ```bash
   openssl genrsa -out private.pem 2048
   openssl rsa -in private.pem -pubout -out public.pem
   ```
   - Update `.env` with SSO_PRIVATE_KEY and SSO_PUBLIC_KEY
5. Run service: `npm run start:dev`

## Step 4: Postman Setup
1. Import `postman collection/User Collection.postman_collection.json` into Postman
2. Create environment variables in Postman:
   - `gatewayUrl`: Leave as is or set to `http://localhost:8000` (but we'll override for local)
   - For local testing, create new variables:
     - `ssoBaseUrl`: `http://localhost:3001/sso`
     - `userProfileBaseUrl`: `http://localhost:3005/user-profile-service`
     - `orderBaseUrl`: `http://localhost:3003/api`
     - `chatBaseUrl`: `http://localhost:3006/api/chat`
     - `adminBaseUrl`: `http://localhost:3007/admin-service`

3. For local testing, you'll need to manually update request URLs in the collection to use local ports instead of `{{gatewayUrl}}`

## Step 5: Testing Flow

### 1. User Activation
- **Register**: `POST {{ssoBaseUrl}}/register`
  - Body: `{"email": "test@example.com", "password": "password123", "fullName": "Test User"}`
- **Verify OTP**: `POST {{ssoBaseUrl}}/verify-otp`
  - Body: `{"email": "test@example.com", "otp": "123456"}`
- **Login**: `POST {{ssoBaseUrl}}/token`
  - Body: `grant_type=password&username=test@example.com&password=password123&client_id=first-party-app&client_secret=[secret]`
  - Save `access_token` as `ssoToken` variable

### 2. Profile Management
Use `Authorization: Bearer {{ssoToken}}`

- **Get Profile**: `GET {{userProfileBaseUrl}}/profile`
- **Update Profile**: `PATCH {{userProfileBaseUrl}}/profile`
- **Verify Profile**: `POST {{userProfileBaseUrl}}/profile/verify`
- **Contacts**: `GET/POST {{userProfileBaseUrl}}/profile/contacts`

### 3. Preferences
- **Get Preferences**: `GET {{userProfileBaseUrl}}/preferences`
- **Update Preferences**: `PATCH {{userProfileBaseUrl}}/preferences`

### 4. Wallet Service
- **Balance**: `GET {{ssoBaseUrl}}/wallet/balance`
- **Top Up**: `POST {{ssoBaseUrl}}/wallet/top-up`
- **Transactions**: `GET {{ssoBaseUrl}}/wallet/transactions`

### 5. Chat/Notifications
- **Get Conversations**: `GET {{chatBaseUrl}}/live/conversations`
- **Send Message**: `POST {{chatBaseUrl}}/conversations/{id}/messages`

### 6. Orders
- **Create Order**: `POST {{orderBaseUrl}}/orders`
- **List Orders**: `GET {{orderBaseUrl}}/orders`
- **Order Details**: `GET {{orderBaseUrl}}/orders/{id}`
- **Pay for Order**: `POST {{ssoBaseUrl}}/wallet/pay/order/{id}`
- **Payment Status**: `GET {{ssoBaseUrl}}/wallet/pay/order/{id}/status`

### 7. Admin Operations (requires admin token)
- **Update User Status**: `PATCH {{ssoBaseUrl}}/auth/admin/users/{id}/status`
- **Search Users**: `GET {{ssoBaseUrl}}/auth/admin/users`
- **Deactivate Wallet**: `PATCH {{ssoBaseUrl}}/wallet/admin/wallets/{id}/status`

## Demo User
For quick testing, use seeded demo user:
- Email: `demo@vero.local`
- Password: `password`

## Common Issues
- **CORS errors**: Ensure services have CORS enabled
- **JWT verification**: Ensure SSO public key is configured in other services' .env
- **Database connections**: Verify all services can connect to PostgreSQL/Redis
- **Port conflicts**: Check that all required ports are available

## Notes
- The original collection uses `{{gatewayUrl}}` for Kong proxy, but for local testing, update URLs to direct service ports
- Some endpoints may require additional setup (e.g., payment gateways for wallet)
- For full integration testing with Kong, use Docker setup from `apps/api-gateway/TESTING-GUIDE.md`
- Rate limiting and Kong plugins don't apply in local setup

This local testing allows detailed testing of user-related functionality across multiple services.</content>
<parameter name="filePath">D:\vero2 new\test postman collection\User Collection Postman Testing.md