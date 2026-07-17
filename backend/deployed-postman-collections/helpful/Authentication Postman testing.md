# Authentication Postman Testing Guide

## Overview
This guide provides step-by-step instructions to test the Vero2 Authentication Postman collection locally without Docker. The authentication is handled by the SSO service running on port 3001.

## Prerequisites
- Node.js (v18 or later)
- npm (comes with Node.js)
- PostgreSQL (local installation)
- Redis (local installation)
- OpenSSL (for generating RSA keys)

## Step 1: Database Setup
1. Install and start PostgreSQL locally (default port 5432)
2. Create a database named `vero2`:
   ```sql
   CREATE DATABASE vero2;
   ```
3. Create the demo user by running the SQL from `apps/sso/demo-user.sql` in the `vero2` database.
   - Default credentials: email `demo@vero.local`, password `password`

## Step 2: Redis Setup
1. Install and start Redis locally (default port 6379)
2. No additional configuration needed for basic testing

## Step 3: SSO Service Setup
1. Navigate to `apps/sso/` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate RSA key pair for JWT signing:
   ```bash
   openssl genrsa -out private.pem 2048
   openssl rsa -in private.pem -pubout -out public.pem
   ```
4. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```
5. Edit `.env` file:
   - Set `DB_PASSWORD` to your PostgreSQL password
   - Set `SSO_PRIVATE_KEY` to the content of `private.pem` (use `\n` for line breaks)
   - Set `SSO_PUBLIC_KEY` to the content of `public.pem` (use `\n` for line breaks)
   - Adjust other values as needed (Stripe/PayPal optional for auth testing)

## Step 4: Run the Services
Run services in this order:

1. **Redis** (if not already running):
   ```bash
   redis-server
   ```

2. **SSO Service** (in `apps/sso/`):
   ```bash
   npm run start:dev
   ```
   - Service will start on `http://localhost:3001`

## Step 5: Postman Testing
1. Import `postman collection/Authentication.postman_collection.json` into Postman
2. Set environment variables in Postman:
   - `ssoBaseUrl`: `http://localhost:3001/sso`
3. Run the collection tests

## Available Test Scenarios
- User registration and OTP verification
- Login with password grant
- Token refresh
- Admin authentication
- MFA flows (requires OTP setup)

## Demo User
Use the seeded demo user:
- Email: `demo@vero.local`
- Password: `password`

## Troubleshooting
- **Database connection errors**: Verify PostgreSQL is running and credentials in `.env` are correct
- **Redis connection errors**: Ensure Redis is running on port 6379
- **JWT errors**: Verify RSA keys are correctly formatted in `.env`
- **Port conflicts**: Ensure port 3001 is available

## Notes
- For production, generate strong RSA keys and use secure passwords
- The SSO service includes wallet and payment features, but they're optional for basic auth testing
- Full platform testing may require additional services (backend, api-gateway), but auth can be tested independently</content>
<parameter name="filePath">test postman collection/Authentication Postman testing.md