# Admin Service Testing Guide

## Prerequisites

1. **Docker Desktop must be running**
2. **Environment variables configured** in `.env` file at project root:
   - `ADMIN_BOOTSTRAP_SECRET=change-me-bootstrap` (or your custom secret)
   - All database credentials should be set

## Step 1: Start the Admin Service

```bash
# From project root (D:\vero2 new)
docker compose up -d admin-service

# Check if it's running
docker compose ps admin-service

# View logs
docker compose logs -f admin-service
```

## Step 2: Verify Service Health

**Using Postman or curl:**

```bash
GET http://localhost:3007/admin-service/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

## Step 3: Import Postman Collection

1. Open Postman
2. Click **Import** → Select `admin-service/Admin-Service.postman_collection.json`
3. The collection will be imported with these variables:
   - `baseUrl`: `http://localhost:3007/admin-service`
   - `bootstrapSecret`: `change-me-bootstrap` (update if you changed it)
   - `token`: (will be auto-populated after login)

## Step 4: Register First Admin (Bootstrap)

**This is a one-time setup to create the first super admin.**

1. Open Postman collection → **Auth** → **Admin Register**
2. Update the request body if needed:
   ```json
   {
     "email": "super.admin@example.com",
     "password": "AdminPass123!",
     "fullName": "Super Admin",
     "role": "super_admin",
     "bootstrapSecret": "change-me-bootstrap"
   }
   ```
3. **Important**: Make sure `bootstrapSecret` matches your `.env` value
4. Click **Send**

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "id": "...",
    "email": "super.admin@example.com",
    "fullName": "Super Admin",
    "role": "super_admin",
    "permissions": []
  }
}
```

**Common Errors:**
- `403 Forbidden - Invalid bootstrap secret`: Check that `ADMIN_BOOTSTRAP_SECRET` in `.env` matches the request
- `400 Bad Request - Admin already exists`: Admin with this email already exists (skip to login)

## Step 5: Login as Admin

1. Open **Auth** → **Admin Login**
2. Update credentials:
   ```json
   {
     "email": "super.admin@example.com",
     "password": "AdminPass123!"
   }
   ```
3. Click **Send**

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "admin": {
      "id": "...",
      "email": "super.admin@example.com",
      "fullName": "Super Admin",
      "role": "super_admin",
      "permissions": []
    }
  }
}
```

**The token is automatically saved** to the collection variable `{{token}}` for subsequent requests.

**Common Errors:**
- `401 Unauthorized - Invalid credentials`: 
  - Check email/password are correct
  - Make sure you registered the admin first (Step 4)
  - Verify the admin exists in the database

## Step 6: Test Protected Endpoints

All other endpoints require authentication. The token from Step 5 is automatically included.

### Test User Management

1. **List Users**: `GET /users?page=1&limit=10`
2. **Get User Details**: `GET /users/{{userId}}` (update `userId` variable)
3. **Update User Status**: `PATCH /users/{{userId}}/status`

### Test Admin Management (Super Admin Only)

1. **List Admins**: `GET /admins?role=all&page=1&limit=20`
2. **Create Admin**: `POST /admins` (creates additional admins)
3. **Update Admin**: `PATCH /admins/{{adminId}}`
4. **Delete Admin**: `DELETE /admins/{{adminId}}`

### Test Analytics

1. **Dashboard Analytics**: `GET /analytics/dashboard`
2. **User Analytics**: `GET /analytics/users`
3. **Order Analytics**: `GET /analytics/orders`
4. **Payment Analytics**: `GET /analytics/payments`
5. **Revenue Analytics**: `GET /analytics/revenue`

### Test Activity Logs

1. **Activity Logs**: `GET /logs/activity?page=1&limit=25`
2. **Audit Trails**: `GET /logs/audit`
3. **System Events**: `GET /logs/system-events`

### Test Other Modules

- **Notifications**: List, mark as read
- **Chat Management**: Topics, predefined messages
- **Reports**: Financial, user, order reports
- **System Settings**: Get/update settings, health, statistics

## Troubleshooting

### Service Not Starting

```bash
# Check logs
docker compose logs admin-service

# Rebuild if needed
docker compose build admin-service
docker compose up -d admin-service
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check MongoDB is running
docker compose ps mongo

# Verify environment variables
docker compose exec admin-service env | grep ADMIN_DB
docker compose exec admin-service env | grep ADMIN_BOOTSTRAP_SECRET
```

### Token Not Working

- Token expires after 15 minutes (900 seconds)
- Re-run **Admin Login** to get a new token
- Check token is saved in Postman collection variables

### Bootstrap Secret Mismatch

1. Check `.env` file has `ADMIN_BOOTSTRAP_SECRET=change-me-bootstrap`
2. Restart admin-service: `docker compose restart admin-service`
3. Update Postman variable `bootstrapSecret` to match

## Quick Test Checklist

- [ ] Service health check returns 200
- [ ] Admin registration succeeds (first time only)
- [ ] Admin login returns token
- [ ] Token is auto-saved in Postman
- [ ] Protected endpoints work with token
- [ ] Super admin can create other admins
- [ ] User management endpoints work
- [ ] Analytics endpoints return data (may be empty initially)

## API Base URL

- **Local**: `http://localhost:3007/admin-service`
- **Docker Network**: `http://admin-service:3007/admin-service`

## Swagger Documentation

Once the service is running, visit:
- **Swagger UI**: `http://localhost:3007/admin-service/api`

